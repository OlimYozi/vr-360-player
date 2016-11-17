const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from './CorePlayer';
import Mode from './Mode';
import Scene, { ISceneData } from './Entities/Scene';
import FS from './Utils/FS';
import DeviceOrientationService from './Services/DeviceOrientationService';

export default class PanoramaMode extends Mode implements ILifeCycle {

  private _deviceOrientationService: DeviceOrientationService;

  constructor(private _player: CorePlayer) {
    super(_player);
  }

  onCreate() {
    super.onCreate();
    this._deviceOrientationService = new DeviceOrientationService();

    // Exit fullscreen if active on launch
    this._player.exitFullscreen();

    // Insert stage into the DOM
    this.player.controls.registerMethod('deviceOrientation', this._deviceOrientationService);
    this.player.controls.enableMethod('deviceOrientation');
    this.onResize();
    return true;
  }

  onResume() {
    super.onResume();
  }

  onResize() {
    super.onResize();
  }

  onPause() {
    super.onPause();
  }

  onDestroy() {
    this.player.controls.unregisterMethod('deviceOrientation');
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

}