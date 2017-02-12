const Marzipano = require('marzipano');

import 'core-js/es6';

import ControlsManager from './Managers/ControlsManager';
import ScenesManager from './Managers/ScenesManager';
import Mode from './Mode';
import PanoramaMode from './PanoramaMode';
import StereoscopicMode from './StereoscopicMode';

import '../styles/index.scss';

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
  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy();
}

/** Virtual reality 360 degree player library supporting panoramic and stereoscopic modes. */
export default class Player implements ILifeCycle {

  private _controlsManager: ControlsManager;
  private _scenesManager: ScenesManager;

  private _viewer: any;
  private _mode: Mode;

  /* Modes */
  private _panoramaMode: PanoramaMode;
  private _stereoscopicMode: StereoscopicMode;

  /** The constructor initializes managers, modes and inserts the viewer into the dom before calling onCreate().
   * @param _node the canvas element to which the player shall be attached to.
   * @param _stagePath the path from which to load the stage.json file accompanied by the tiles folder with each stage scenes images.
   * @param _initialSceneId the id of the initial scene to load, must be declared inside the stage.json.
   */
  constructor(private _node: HTMLElement, private _stagePath: string, private _initialSceneId?: string) {
    // Create managers for controls and scenes
    this._controlsManager = new ControlsManager(this);
    this._scenesManager = new ScenesManager(this);

    // Insert viewer and stage into the DOM
    this._viewer = new Marzipano.Viewer(this._node, {
      stageType: 'webgl'
    });

    // Initialize view modes for faster switching
    this._panoramaMode = new PanoramaMode(this);
    this._stereoscopicMode = new StereoscopicMode(this);
    this._mode = this._panoramaMode;

    // Bind methods to this context
    this.onResume = this.onResume.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onDestroy = this.onDestroy.bind(this);

    // Call resize to fit viewer to parent canvas and then call onCreate().
    this.onResize();
    this.onCreate();
  }

  /** Called after the constructor to create variables that later need to be disposed. */
  onCreate() {
    this.controlsManager.onCreate();
    this.scenesManager.loadFromFile(this._stagePath, () => {
      // Select initial scene to load.
      this._initialSceneId = this._initialSceneId || this.scenesManager.sceneIds.next().value;

      // Create first scene with transition and callback.
      this.scenesManager.switchScene(this._initialSceneId, true, () => {
        this.mode.onCreate();
      });
    });

    // Event Listeners
    window.addEventListener('focus', this.onResume);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('blur', this.onPause);
    window.addEventListener('unload', this.onDestroy);
  }

  /** Called when window is focused after blur. */
  onResume() {
    this.mode.onResume();
  }

  /** Called when window viewport size changes. */
  onResize() {
    this.viewer.updateSize();
    this.mode.onResize();
  }

  /** Called when window is blurred after focus. */
  onPause() {
    this.mode.onPause();
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    window.removeEventListener('focus', this.onResume);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('blur', this.onPause);
    window.removeEventListener('unload', this.onDestroy);

    this._controlsManager.onDestroy();
    this._scenesManager.onDestroy();
    this._viewer.destroy();
    this._panoramaMode.onDestroy();
    this._stereoscopicMode.onDestroy();

    this._controlsManager = null;
    this._scenesManager = null;
    this._viewer = null;
    this._mode = null;
    this._panoramaMode = null;
    this._stereoscopicMode = null;
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  /** Toggle current mode between [[PanoramaMode]] and [[StereoscopicMode]].
   * @return The newely create and switched to mode.
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
    this.scenesManager.switchScene(this.scenesManager.current.id, false);

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

  /** Retrieves the path from which the current scene was loaded. */
  public get stagePath(): string {
    return this._stagePath;
  }

  /** Retrieves the manager that is responsible for scene loading and switching. */
  public get scenesManager(): ScenesManager {
    return this._scenesManager;
  }

  /** Retrieves the manager that is responsible for the interface controls and methods. */
  public get controlsManager(): ControlsManager {
    return this._controlsManager;
  }

  /** Retrieves the main viewer instance that renders the stage and scenes. */
  public get viewer(): any {
    return this._viewer;
  }

  /** Retrieves the viewers control methods such as [[DeviceOrientationService]], not to be confused with [[ControlsManager]]. */
  public get controls(): any {
    return this.viewer.controls();
  }

  /** Retrieves the current view mode of either type [[PanoramaMode]] or [[StereoscopicModes]]. */
  public get mode(): Mode {
    return this._mode;
  }
}