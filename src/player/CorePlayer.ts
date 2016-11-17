const Marzipano = require('marzipano');

import ControlsManager from './Managers/ControlsManager';
import SceneManager from './Managers/SceneManager';
import Mode from './Mode';
import PanoramaMode from './PanoramaMode';
import StereoscopicMode from './StereoscopicMode';

export interface ILifeCycle {
  onCreate();
  onResume();
  onResize();
  onPause();
  onDestroy();
}

/**
 * Virtual reality 360 player library
 */
export default class CorePlayer implements ILifeCycle {

  private _controlsManager: ControlsManager;
  private _sceneManager: SceneManager;

  private _viewer: any;
  private _mode: Mode;

  /* Modes */
  private _panoramaMode: PanoramaMode;
  private _stereoscopicMode: StereoscopicMode;

  constructor(private _node: HTMLElement, private _stagePath: string) {
    this._controlsManager = new ControlsManager(this);
    this._sceneManager = new SceneManager(this);

    // Insert stage into the DOM
    this._viewer = new Marzipano.Viewer(this._node, {
      stageType: 'webgl'
    });

    this._panoramaMode = new PanoramaMode(this);
    this._stereoscopicMode = new StereoscopicMode(this);
    this._mode = this._panoramaMode;

    this.onResize();
    this.onCreate();
  }

  onCreate() {
    this.controlsManager.onCreate();
    this.mode.onCreate();
    this.sceneManager.loadFromFile(this._stagePath, () => {
      this.sceneManager.switchScene('0-livingroom');
    });
  }

  onResume() {
    this.mode.onResume();
  }

  onResize() {
    this.viewer.updateSize();
    this.mode.onResize();
  }

  onPause() {
    this.mode.onPause();
  }

  onDestroy() {
    this.viewer.onDestroy();
    this.mode.onDestroy();
    this.controlsManager.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  public toggleMode(): Mode {
    this.mode.onDestroy();
    if (this.mode instanceof PanoramaMode) {
      this._mode = this._stereoscopicMode;
    } else {
      this._mode = this._panoramaMode;
    }
    this.sceneManager.current.onAttach();
    this.sceneManager.emit('sceneAttached', this.sceneManager.current);
    this.mode.onCreate();
    return this.mode;
  }

  public requestFullscreen(element?: any) {
    element = element || document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  public exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get sceneManager(): SceneManager {
    return this._sceneManager;
  }

  public get controlsManager(): ControlsManager {
    return this._controlsManager;
  }

  public get viewer(): any {
    return this._viewer;
  }

  public get controls(): any {
    return this.viewer.controls();
  }

  public get mode(): Mode {
    return this._mode;
  }
}