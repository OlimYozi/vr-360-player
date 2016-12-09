const Marzipano = require('marzipano');

import HTTP from '../Utils/HTTP';
import Transition from '../Utils/Transition';
import Player, { ILifeCycle } from '../Player';
import Scene, { ISceneData } from '../Entities/Scene';

/** Interface describing the required data to create new [[Scene]]s. */
export interface IStageJSON {
  scenes: ISceneData[];
}

/** Class for managing scenes and switching between them. */
export default class ScenesManager {

  static TRANSITION_DURATION = 300;
  static TRANSITION_ATTACH = Transition.FadeIn();
  static TRANSITION_DETATCH = Transition.FadeOut();

  private _scenes = new Map<string, Scene>();
  private _current: Scene;
  private _events = [];

  /** Contructor binding event methods, however does not create anything until the [[onCreate]] method is called.
   * @param _player The base player context.
   */
  constructor(public player: Player) {
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    this._scenes.forEach((scene: Scene) => {
      scene.onDestroy();
    });
    this._scenes.clear();
    this._current = null;
    this._events = null;
  }

  /** Load scenes from a json string containing at least the values specified in [[IStageJSON]].
   * See README for more information.
   * @param json The data following [[IStageJSON]] format.
   */
  public load(json: string) {
    let data = <IStageJSON>JSON.parse(json);
    data.scenes.forEach((sceneJSON: ISceneData) => {
      let scene = Scene.fromJSON(this.player, sceneJSON);
      scene.onCreate();
      this.addScene(sceneJSON.id, scene);
    });
  }

  /** Load scenes from a json file path containing at least the values specified in [[IStageJSON]].
   * See README for more information.
   * @param path The data path following [[IStageJSON]] format.
   * @param callback The function to call when configuration is loaded.
   */
  public loadFromFile(path: string, callback: () => void) {
    HTTP.get(path, null, (res) => {
      this.load(res);
      callback();
    });
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  /** Adds a new scene to the manager. */
  public addScene(id: string, scene: Scene) {
    this.scenes.set(id, scene);
  }

  /** Retrieves if exits the scene connected to supplied id. */
  public getScene(id: string): Scene {
    return this.scenes.get(id);
  }

  /** Switches to a new scene using id and optionally using a transition.
   * @param id The scene id to switch to.
   * @param transition Boolean defining if a transition should be used when switching scenes.
   * @param done The callback to call when switch is complete.
  */
  public switchScene(id: string, transition = true, done?: () => void) {
    const newScene = this.scenes.get(id);
    if (!newScene) {
      if (typeof done === 'function') done();
      return;
    }

    if (!this.current) {
      newScene.onAttach(
        transition ? ScenesManager.TRANSITION_ATTACH : null,
        transition ? ScenesManager.TRANSITION_DURATION * 2 : null,
        () => {
          this.current = newScene;
          if (typeof done === 'function') done();
        });
      return;
    }

    this.current.onDetatch(
      transition ? ScenesManager.TRANSITION_DETATCH : null,
      transition ? ScenesManager.TRANSITION_DURATION : null,
      () => {
        this.emit('sceneDetached', this.current);
        this.current = newScene;
        this.current.onAttach(
          transition ? ScenesManager.TRANSITION_ATTACH : null,
          transition ? ScenesManager.TRANSITION_DURATION : null,
          () => {
            this.emit('sceneAttached', this.current);
            if (typeof done === 'function') done();
          }
        );
      }
    );
  }

  /** Add a new EventListener */
  public addEventListener(event: string, fn: (event?: string, data?: any) => void) {
    var handlerList = this._events[event] = this._events[event] || [];
    handlerList.push(fn);
  };

  /** Remove an added EventListener */
  public removeEventListener(event: string, fn: (event?: string, data?: any) => void) {
    var handlerList = this._events[event];
    if (handlerList) {
      var index = handlerList.indexOf(fn);
      if (index >= 0) {
        handlerList.splice(index, 1);
      }
    }
  };

  /** Emit a new event */
  public emit(event: string, data: any) {
    var handlerList = this._events[event];
    if (handlerList) {
      for (var i = 0; i < handlerList.length; i++) {
        var fn = handlerList[i];
        fn.apply(this, [event, data]);
      }
    }
  };

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /** Retrieves all loaded scenes. */
  public get scenes(): Map<string, Scene> {
    return this._scenes;
  }

  /** Retrieves all loaded scene ids */
  public get sceneIds(): IterableIterator<string> {
    return this._scenes.keys();
  }

  /** Retrieves currently displayed scene. */
  public get current(): Scene {
    return this._current;
  }

  /** Assigns a new scene to be displayed. */
  public set current(scene: Scene) {
    this._current = scene;
  }
}