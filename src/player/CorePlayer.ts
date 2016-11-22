const Marzipano = require('marzipano');

import ControlsManager from './Managers/ControlsManager';
import SceneManager from './Managers/SceneManager';
import Mode from './Mode';
import PanoramaMode from './PanoramaMode';
import StereoscopicMode from './StereoscopicMode';

/** Interface defining the life cycle methods the class is expected to implement. */
export interface ILifeCycle {
  /** Called after the constructor to create variables that later need to be disposed. */
  onCreate();
  /** Called when window is focused after blur. */
  onResume();
  /** Called when window viewport size changes. */
  onResize();
  /** Called when window is blurred after focus. */
  onPause();
  /** Should be called at the end of a class' life cycle and should dispose all assigned variables.  */
  onDestroy();
}

/** Virtual reality 360 degree player library supporting panoramic and stereoscopic modes. */
export default class CorePlayer implements ILifeCycle {

  private _controlsManager: ControlsManager;
  private _sceneManager: SceneManager;

  private _viewer: any;
  private _mode: Mode;

  /* Modes */
  private _panoramaMode: PanoramaMode;
  private _stereoscopicMode: StereoscopicMode;

  /** The constructor initializes managers, modes and inserts the viewer into the dom before calling onCreate().
   * @param _node the canvas element to which the player shall be attached to.
   * @param _stagePath the path from which to load the stage.json file accompanied by the tiles folder with each stage scenes images.
   */
  constructor(private _node: HTMLElement, private _stagePath: string) {
    // Create managers for controls and scenes
    this._controlsManager = new ControlsManager(this);
    this._sceneManager = new SceneManager(this);

    // Insert viewer and stage into the DOM
    this._viewer = new Marzipano.Viewer(this._node, {
      stageType: 'webgl'
    });

    // Initialize view modes for faster switching
    this._panoramaMode = new PanoramaMode(this);
    this._stereoscopicMode = new StereoscopicMode(this);
    this._mode = this._panoramaMode;

    // Call resize to fit viewer to parent canvas and then call onCreate().
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

  /** Toggle current mode between [[PanoramaMode]] and [[StereoscopicMode]]
   * @return The newely create and switched to mode
   */
  public toggleMode(): Mode {
    // Destroy old mode
    this.mode.onDestroy();
    if (this.mode instanceof PanoramaMode) {
      this._mode = this._stereoscopicMode;
    } else {
      this._mode = this._panoramaMode;
    }
    // Create new mode
    this.mode.onCreate();

    // Detach and re-attach scene
    this.sceneManager.switchScene(this.sceneManager.current.id);

    return this.mode;
  }

  /** Requests the browser to enter fullscreen mode, requires a user triggered event.
   * @param element Element to use as basis for fullscreen, uses documentElement if omitted.
   */
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

  /** Exits fullscreen mode if currently active. */
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