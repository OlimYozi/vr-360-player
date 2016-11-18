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
  private _deviceOrientationService: DeviceOrientationService;

  /* SETTINGS */
  private _dominantEye: 'left' | 'right' = 'left';

  /* SCENE */
  private _scene: Scene;
  private _hotspots: Hotspot[];
  private _center = new Vector3();
  private _navigationTimeout;

  constructor(public player: CorePlayer) {
    super(player);
  }

  onCreate() {
    super.onCreate();
    this._wakeLockService = new WakeLockService();
    this._deviceOrientationService = new DeviceOrientationService();

    // Request fullscreen on launch
    this.player.requestFullscreen();

    // Lock the screen orientation.
    if (screen.lockOrientation) {
      screen.lockOrientation('landscape');
    }
    // Prevent display from sleeping on mobile devices.
    this._wakeLockService.enable();

    // Insert stage into the DOM
    this.player.controls.registerMethod('deviceOrientation', this._deviceOrientationService);
    this.player.controls.enableMethod('deviceOrientation');
    this.onResize();

    // Bind methods to this context
    this.onSceneChange = this.onSceneChange.bind(this);
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);

    this.player.sceneManager.addEventListener('sceneAttached', this.onSceneChange);
    this._deviceOrientationService.addEventListener('parameterDynamics', this.onDeviceOrientation);

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
    this.player.controls.unregisterMethod('deviceOrientation');
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

  private onDeviceOrientation() {
    if (!this._scene)
      return;

    this._center.yaw = this._scene.view.yaw();
    this._center.pitch = this._scene.view.pitch();

    this._hotspots.forEach((hotspot: Hotspot) => {
      if (hotspot.position.distance(this._center) < 0.2) {
        if (!hotspot.node.classList.contains('active')) {
          hotspot.node.classList.add('active');
          this._navigationTimeout = setTimeout(() => {
            if (hotspot['target'])
              this.player.sceneManager.switchScene(hotspot['target']);
          }, 1600);
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