import Player, { ILifeCycle } from '../Player';
import Mode from '../Mode';
import PanoramaMode from '../PanoramaMode';
import StereoscopicMode from '../StereoscopicMode';
import Vector4 from "../Math/Vector4";

/** Class for finding and adding methods to interface conrollers. */
export default class ControlsManager implements ILifeCycle {

  /* Nodes */
  private _controls: HTMLElement;
  private _crosshair: HTMLElement;
  private _projectionX: HTMLElement;
  private _sensorToggler: HTMLElement;
  private _modeToggler: HTMLElement;
  private _eyeToggler: HTMLElement;

  /** Contructor binding event methods, however does not create anything until the [[onCreate]] method is called.
   * @param _player The base player context.
   */
  constructor(private _player: Player) {
    // Bind event listeners
    this.onProjectionXChange = this.onProjectionXChange.bind(this);
    this.onSensorToggle = this.onSensorToggle.bind(this);
    this.onModeToggle = this.onModeToggle.bind(this);
    this.onEyeToggle = this.onEyeToggle.bind(this);
  }

  /** Called after the constructor to create variables that later need to be disposed.
   * Finds controller dom nodes and adds event listeners connected to event handlers.
   */
  onCreate() {
    this._controls = document.getElementById('controls');
    this._crosshair = document.getElementById('crosshair');
    this._projectionX = document.getElementById('projection-x');
    this._sensorToggler = document.getElementById('sensor-toggler');
    this._modeToggler = document.getElementById('mode-toggler');
    this._eyeToggler = document.getElementById('eye-toggler');

    this._projectionX.addEventListener('input', this.onProjectionXChange);
    this._sensorToggler.addEventListener('click', this.onSensorToggle);
    this._modeToggler.addEventListener('click', this.onModeToggle);
    this._eyeToggler.addEventListener('click', this.onEyeToggle);
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
    this._projectionX.removeEventListener('input', this.onProjectionXChange);
    this._sensorToggler.removeEventListener('click', this.onSensorToggle);
    this._modeToggler.removeEventListener('click', this.onModeToggle);
    this._eyeToggler.removeEventListener('click', this.onEyeToggle);

    this._controls = null;
    this._crosshair = null;
    this._sensorToggler = null;
    this._modeToggler = null;
    this._eyeToggler = null;
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  /** Shows all interface controls. */
  public showControls() {
    this._controls.classList.add('shown');
  }

  /** Hides all, but crosshair interface controls. */
  public hideControls() {
    this._controls.classList.remove('shown');
  }

  /** Updates the projection X center. */
  public onProjectionXChange(event: Event) {
    (<StereoscopicMode>this._player.mode).projectionCenter =
      new Vector4(parseFloat((<HTMLInputElement>event.target).value), 0.5);
  }

  /** Shows the sensor toggle interface control. */
  public showSensorToggle() {
    this._sensorToggler.style.display = 'inline-block';
  }

  /** Assigns a new state to the sensor interface control. */
  public setSensorToggleState(active: boolean) {
    if (active) {
      this._sensorToggler.classList.remove('icon_orientation_sensor');
      this._sensorToggler.classList.add('icon_orientation_drag');
    } else {
      this._sensorToggler.classList.remove('icon_orientation_drag');
      this._sensorToggler.classList.add('icon_orientation_sensor');
    }
  }

  /** Toggles between the two sensor states. */
  public onSensorToggle(event: MouseEvent) {
    const active = this._player.mode.toggleSensor();
    this.setSensorToggleState(active);
  }

  /** Assigns a new state to the player mode interface control. */
  public setModeToggleState(mode: Mode) {
    if (mode instanceof PanoramaMode) {
      this._crosshair.style.display = 'none';
      this._projectionX.style.display = 'none';
      this._eyeToggler.style.display = 'none';
      this._modeToggler.classList.remove('icon_panorama');
      this._modeToggler.classList.add('icon_vr');
    } else {
      this._crosshair.style.display = 'block';
      this._projectionX.style.display = 'inline-block';
      this._eyeToggler.style.display = 'inline-block';
      this._modeToggler.classList.remove('icon_vr');
      this._modeToggler.classList.add('icon_panorama');
    }
  }

  /** Toggles between the two player mode states. */
  public onModeToggle(event: MouseEvent) {
    const mode = this._player.toggleMode();
    this.setModeToggleState(mode);
  }

  /** Assigns a new state to the eye interface control. */
  public setEyeToggleState(eye: 'left' | 'right') {
    if (eye === 'left') {
      this._crosshair.style.left = (document.documentElement.clientWidth / 4) + 'px';
      this._eyeToggler.classList.remove('icon_eye_right');
      this._eyeToggler.classList.add('icon_eye_left');
    } else {
      this._crosshair.style.left = (document.documentElement.clientWidth / 4 * 3) + 'px';
      this._eyeToggler.classList.remove('icon_eye_left');
      this._eyeToggler.classList.add('icon_eye_right');
    }
  }

  /** Toggles between the two eye states. */
  public onEyeToggle(event: MouseEvent) {
    const eye = (<StereoscopicMode>this._player.mode).toggleEye();
    this.setEyeToggleState(eye);
  }
}