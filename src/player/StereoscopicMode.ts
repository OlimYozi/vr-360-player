const Marzipano = require('marzipano');

import Player, { ILifeCycle } from './Player';
import FS from './Utils/FS';
import Vector4 from './Math/Vector4';
import Mode from './Mode';
import Scene, { ISceneData } from './Entities/Scene';
import Hotspot from './Entities/Hotspot/Hotspot';
import LinkHotspot from './Entities/Hotspot/LinkHotspot';
import InfoHotspot from './Entities/Hotspot/InfoHotspot';
import WakeLockService from './Services/WakeLockService';
import DeviceOrientationService from './Services/DeviceOrientationService';
import PairSet from "./Utils/PairSet";

/** Class used for enabling the stereoscopic mode in the player. This emulates WebVR with two side-by-side scenes.
 * This mode also uses the device sensor to pan the scene and navigation through prolonged gazing at a [[LinkHotspot]].
 */
export default class StereoscopicMode extends Mode implements ILifeCycle {

  static INTERACTION_EVENTS = ['touchstart', 'touchmove', 'mousedown', 'mousemove', 'drag'];

  private _wakeLockService: WakeLockService;

  /* SCENE */
  private _scene: Scene;
  private _hotspots: PairSet<Hotspot>[];
  private _center = new Vector4();
  private _controlsTimeout;
  private _navigationTimeout;
  private _infoTimeout;

  /** Contructor binding event methods, however does not create anything until the [[onCreate]] method is called.
   * @param _player The base player context.
   */
  constructor(_player: Player) {
    super(_player);

    // Bind methods to this context
    this.onInteraction = this.onInteraction.bind(this);
    this.onSceneChange = this.onSceneChange.bind(this);
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
  }

  /** Called after the constructor to create variables that later need to be disposed.
   * Will also request fullscreen, landscape mode and keep screen awake.
   */
  onCreate() {
    super.onCreate();
    this._wakeLockService = new WakeLockService();

    // Request fullscreen on launch
    this._player.requestFullscreen();

    // Lock the screen orientation.
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').then(null, (error) => {
        // Catch promise error to avoid console error print.
      });
    }

    // Prevent display from sleeping on mobile devices.
    this._wakeLockService.enable();

    this.onResize();

    StereoscopicMode.INTERACTION_EVENTS.forEach((event: string) => {
      window.addEventListener(event, this.onInteraction);
    });

    this._player.scenesManager.addEventListener('sceneAttached', this.onSceneChange);
    this.deviceOrientationService.addEventListener('parameterDynamics', this.onDeviceOrientation);

    // Trigger initial controller hide timeout
    this.onInteraction();
    return true;
  }

  /** Called when window is focused after blur. */
  onResume() {
    super.onResume();
    this._wakeLockService.enable();
  }

  /** Called when window viewport size changes. */
  onResize() {
    super.onResize();
  }

  /** Called when window is blurred after focus. */
  onPause() {
    this._wakeLockService.disable();
    super.onPause();
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    clearTimeout(this._controlsTimeout);
    StereoscopicMode.INTERACTION_EVENTS.forEach((event: string) => {
      window.removeEventListener(event, this.onInteraction);
    });
    this._player.scenesManager.removeEventListener('sceneAttached', this.onSceneChange);
    this.deviceOrientationService.removeEventListener('parameterDynamics', this.onDeviceOrientation);

    this._wakeLockService.onDestroy();
    this._wakeLockService = null;
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  /** Event handler for click and taps on the stage to reveal interface controllers for 3 seconds. */
  public onInteraction() {
    clearTimeout(this._controlsTimeout);
    this._player.controlsManager.showControls();
    this._controlsTimeout = setTimeout(
      this._player.controlsManager.hideControls.bind(this._player.controlsManager),
      3000
    );
  }

  /** Event handler for device orientation used for gaze navigation and displaying info hotspots for 2 seconds. */
  protected onDeviceOrientation() {
    super.onDeviceOrientation();
    if (!this._scene)
      return;

    this._center.pitch = this._player.scenesManager.current.views.primary.pitch();
    this._center.yaw = this._player.scenesManager.current.views.primary.yaw();

    this._hotspots.forEach((hotspotPair: PairSet<Hotspot>) => {
      const primary = hotspotPair.primary;

      // Check if crosshair is near the hotspot
      if (primary.position.distance(this._center) < 0.15) {
        if (!primary.node.classList.contains('active')) {
          hotspotPair.pair(hotspot => hotspot.node.classList.add('active'));

          // If hotspot is of type LinkHotspot trigger a navigation timeout
          if (primary instanceof LinkHotspot) {
            this._navigationTimeout = setTimeout(() => {
              this._player.scenesManager.switchScene(primary.target);
            }, 1500);
          }
        }

        // If hotspot is of type InfoHotspot set a deativation 2s timeout repeatedly until crosshair leaves area
        if (primary instanceof InfoHotspot) {
          clearTimeout(this._infoTimeout);
          this._infoTimeout = setTimeout(() => {
            hotspotPair.pair(hotspot => hotspot.node.classList.remove('active'));
          }, 2000);
        }
      } else {

        // If hotspot is of type LinkHotspot and active clear navigation timeout due to crosshair has left hotspot vicinity
        if (primary instanceof LinkHotspot && primary.node.classList.contains('active')) {
          hotspotPair.pair(hotspot => hotspot.node.classList.remove('active'));
          clearTimeout(this._navigationTimeout);
        }
      }
    })
  }

  /** Event handler for scene changes saving the new data in variables for later use. */
  private onSceneChange(event: string, scene: Scene) {
    this._scene = scene;
    this._hotspots = [].concat(scene.linkHotspots).concat(scene.infoHotspots);
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /** Assigns the center to use for the view projection. */
  public set projectionCenter(center: Vector4) {
    this._scene.projectionCenter = center;
  }

  /** Retrieves the current projection center for the views. */
  public get projectionCenter(): Vector4 {
    return this._scene.projectionCenter;
  }
}