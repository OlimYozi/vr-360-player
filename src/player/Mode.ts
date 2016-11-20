const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from './CorePlayer';
import DeviceOrientationService from './Services/DeviceOrientationService';

export default class Mode implements ILifeCycle {

  private _deviceOrientationService: DeviceOrientationService;

  constructor(protected _player: CorePlayer) {
  }

  onCreate() {
    this._deviceOrientationService = new DeviceOrientationService();

    this.deviceOrientationService.getPitch((err, pitch) => {
      if (err) return;
      this._player.sceneManager.current.view.setPitch(-pitch);
    });

    this._player.controls.registerMethod('deviceOrientation', this._deviceOrientationService);
    this._player.controls.enableMethod('deviceOrientation');
  }

  onResume() {
  }

  onResize() {
  }

  onPause() {
  }

  onDestroy() {
    this._player.controls.unregisterMethod('deviceOrientation');
    this._deviceOrientationService.destroy();
    this._deviceOrientationService = null;
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get deviceOrientationService(): DeviceOrientationService {
    return this._deviceOrientationService;
  }
}