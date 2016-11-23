const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from './CorePlayer';
import FS from './Utils/FS';
import Vector3 from './Math/Vector3';
import Mode from './Mode';
import Scene, { ISceneData } from './Entities/Scene';
import Hotspot from './Entities/Hotspot/Hotspot';
import WakeLockService from './Services/WakeLockService';
import DeviceOrientationService from './Services/DeviceOrientationService';

export default class StereoscopicMode extends Mode implements ILifeCycle {

  private _wakeLockService: WakeLockService;

  /* SETTINGS */
  private _dominantEye: 'left' | 'right' = 'left';

  /* SCENE */
  private _scene: Scene;
  private _hotspots: Hotspot[];
  private _center = new Vector3();
  private _controlsTimeout;
  private _navigationTimeout;

  constructor(_player: CorePlayer) {
    super(_player);

    // Bind methods to this context
    this.onClick = this.onClick.bind(this);
    this.onSceneChange = this.onSceneChange.bind(this);
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
  }

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

    window.addEventListener('click', this.onClick);
    this._player.sceneManager.addEventListener('sceneAttached', this.onSceneChange);
    this.deviceOrientationService.addEventListener('parameterDynamics', this.onDeviceOrientation);

    // Trigger initial controller hide timeout
    this.onClick();
    return true;
  }

  onResume() {
    super.onResume();
    this._wakeLockService.enable();
  }

  onResize() {
    super.onResize();
  }

  onPause() {
    this._wakeLockService.disable();
    super.onPause();
  }

  onDestroy() {
    clearTimeout(this._controlsTimeout);
    window.removeEventListener('click', this.onClick);
    this._player.sceneManager.removeEventListener('sceneAttached', this.onSceneChange);
    this.deviceOrientationService.removeEventListener('parameterDynamics', this.onDeviceOrientation);

    this._wakeLockService.onDestroy();
    this._wakeLockService = null;
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  public toggleEye(): 'left' | 'right' {
    this._dominantEye = this._dominantEye === 'left' ? 'right' : 'left';
    this._scene.setEye(this._dominantEye);
    return this._dominantEye;
  }

  public onClick() {
    clearTimeout(this._controlsTimeout);
    this._player.controlsManager.showControls();
    this._controlsTimeout = setTimeout(
      this._player.controlsManager.hideControls.bind(this._player.controlsManager),
      3000
    );
  }

  protected onDeviceOrientation() {
    super.onDeviceOrientation();
    if (!this._scene)
      return;

    this._center.yaw = this._player.sceneManager.current.view.yaw();
    this._center.pitch = this._player.sceneManager.current.view.pitch();

    this._hotspots.forEach((hotspot: Hotspot) => {
      if (hotspot.position.distance(this._center) < 0.15) {
        if (!hotspot.node.classList.contains('active')) {
          hotspot.node.classList.add('active');
          this._navigationTimeout = setTimeout(() => {
            if (hotspot['target'])
              this._player.sceneManager.switchScene(hotspot['target']);
          }, 1500);
        }
      } else {
        if (hotspot.node.classList.contains('active'))
          clearTimeout(this._navigationTimeout);
        hotspot.node.classList.remove('active');
      }
    })
  }

  private onSceneChange(event: string, scene: Scene) {
    this._scene = scene;
    this._hotspots = [].concat(scene.linkHotspots).concat(scene.infoHotspots);
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get dominantEye(): 'left' | 'right' {
    return this._dominantEye;
  }
}