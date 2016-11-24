const Marzipano = require('marzipano');

import Player, { ILifeCycle } from './Player';
import DeviceOrientationService from './Services/DeviceOrientationService';

/** Base class for the different player modes. */
export default class Mode implements ILifeCycle {

  private _deviceOrientationService: DeviceOrientationService;
  private _deviceOrientationActive = true;

  /** Contructor binding event methods, however does not create anything until the [[onCreate]] method is called.
   * @param _player The base player context.
   */
  constructor(protected _player: Player) {
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
  }

  /** Called after the constructor to create variables that later need to be disposed.
   * Will also enable device orientation sensor by default.
   */
  onCreate() {
    this._deviceOrientationService = new DeviceOrientationService();

    this._deviceOrientationService.getPitch((err, pitch) => {
      if (err) return;
      this._player.scenesManager.current.view.setPitch(-pitch);
    });

    this._player.controls.registerMethod('deviceOrientation', this._deviceOrientationService);
    this._player.controls.enableMethod('deviceOrientation');

    this._deviceOrientationService.addEventListener('parameterDynamics', this.onDeviceOrientation);

    this._player.controlsManager.setSensorToggleState(this._deviceOrientationActive = true);
  }

  /** Called when window is focused after blur. */
  onResume() {
  }

  /** Called when window viewport size changes. */
  onResize() {
  }

  /** Called when window is blurred after focus. */
  onPause() {
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    this._player.controls.unregisterMethod('deviceOrientation');
    this._deviceOrientationService.removeEventListener('parameterDynamics', this.onDeviceOrientation);
    this._deviceOrientationService.destroy();
    this._deviceOrientationService = null;
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  /** Toggles the active state of the device sensor for player panning. */
  public toggleSensor(): boolean {
    this._deviceOrientationActive = !this._deviceOrientationActive;
    if (this._deviceOrientationActive) {
      this._player.controls.enableMethod('deviceOrientation');
    } else {
      this._player.controls.disableMethod('deviceOrientation');
    }
    return this._deviceOrientationActive;
  }

  /** Event handler for device orientation. */
  protected onDeviceOrientation() {
    this._player.controlsManager.showSensorToggle();
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /** Retrieves the device orientation service used for player panning. */
  public get deviceOrientationService(): DeviceOrientationService {
    return this._deviceOrientationService;
  }
}