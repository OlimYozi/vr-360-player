const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from './CorePlayer';
import DeviceOrientationService from './Services/DeviceOrientationService';

export default class Mode implements ILifeCycle {

  private _deviceOrientationService: DeviceOrientationService;
  private _deviceOrientationActive = true;

  constructor(protected _player: CorePlayer) {
  }

  onCreate() {
    this._deviceOrientationService = new DeviceOrientationService();

    this._deviceOrientationService.getPitch((err, pitch) => {
      if (err) return;
      this._player.sceneManager.current.view.setPitch(-pitch);
    });

    this._player.controls.registerMethod('deviceOrientation', this._deviceOrientationService);
    this._player.controls.enableMethod('deviceOrientation');

    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);

    this._deviceOrientationService.addEventListener('parameterDynamics', this.onDeviceOrientation);

    this._player.controlsManager.setSensorToggleState(this._deviceOrientationActive = true);
  }

  onResume() {
  }

  onResize() {
  }

  onPause() {
  }

  onDestroy() {
    this._player.controls.unregisterMethod('deviceOrientation');
    this._deviceOrientationService.removeEventListener('parameterDynamics', this.onDeviceOrientation);
    this._deviceOrientationService.destroy();
    this._deviceOrientationService = null;
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  public toggleSensor(): boolean {
    this._deviceOrientationActive = !this._deviceOrientationActive;
    if (this._deviceOrientationActive) {
      this._player.controls.enableMethod('deviceOrientation');
    } else {
      this._player.controls.disableMethod('deviceOrientation');
    }
    return this._deviceOrientationActive;
  }

  protected onDeviceOrientation() {
    this._player.controlsManager.showSensorToggle();
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get deviceOrientationService(): DeviceOrientationService {
    return this._deviceOrientationService;
  }
}