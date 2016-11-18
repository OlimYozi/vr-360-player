import CorePlayer, { ILifeCycle } from '../CorePlayer';
import PanoramaMode from '../PanoramaMode';
import StereoscopicMode from '../StereoscopicMode';

export default class ControlsManager implements ILifeCycle {

  /* Nodes */
  private _crosshair: HTMLElement;
  private _modeToggler: HTMLElement;
  private _eyeToggler: HTMLElement;

  constructor(private _player: CorePlayer) {
    // Bind event listeners
    this.onModeToggle = this.onModeToggle.bind(this);
    this.onEyeToggle = this.onEyeToggle.bind(this);
  }

  onCreate() {
    this._crosshair = document.getElementById('crosshair');
    this._modeToggler = document.getElementById('mode-toggler');
    this._eyeToggler = document.getElementById('eye-toggler');

    this._modeToggler.addEventListener('click', this.onModeToggle);
    this._eyeToggler.addEventListener('click', this.onEyeToggle);
  }

  onResume() {
  }

  onResize() {
  }

  onPause() {
  }

  onDestroy() {
    this._modeToggler.removeEventListener('click', this.onModeToggle);
    this._eyeToggler.removeEventListener('click', this.onEyeToggle);
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  private onModeToggle(event: MouseEvent) {
    const mode = this._player.toggleMode();
    if (mode instanceof PanoramaMode) {
      this._crosshair.style.display = 'none';
      this._eyeToggler.style.display = 'none';
      this._modeToggler.classList.remove('icon_panorama');
      this._modeToggler.classList.add('icon_vr');
    } else {
      this._crosshair.style.display = 'block';
      this._eyeToggler.style.display = 'inline-block';
      this._modeToggler.classList.remove('icon_vr');
      this._modeToggler.classList.add('icon_panorama');
    }
  }

  private onEyeToggle(event: MouseEvent) {
    const eye = (<StereoscopicMode>this._player.mode).toggleEye();
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
}