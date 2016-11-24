const Marzipano = require('marzipano');

import HTTP from '../Utils/HTTP';
import Transition from '../Utils/Transition';
import Player, { ILifeCycle } from '../Player';
import Scene, { ISceneData } from '../Entities/Scene';

export interface IStageJSON {
  scenes: ISceneData[];
  name: string;
  settings: {
    autorotateEnabled: boolean,
  }
}

export default class ScenesManager {

  static TRANSITION_DURATION = 300;
  static TRANSITION_ATTACH = Transition.FadeIn();
  static TRANSITION_DETATCH = Transition.FadeOut();

  private _scenes = new Map<string, Scene>();
  private _autoRotate = false;
  private _current: Scene;
  private _events = [];

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

  public load(json: string) {
    let data = <IStageJSON>JSON.parse(json);
    data.scenes.forEach((sceneJSON: ISceneData) => {
      let scene = Scene.fromJSON(this.player, sceneJSON);
      scene.onCreate();
      this.addScene(sceneJSON.id, scene);
    });
  }

  public loadFromFile(path: string, callback: () => void) {
    HTTP.get(path, null, (res) => {
      this.load(res);
      callback();
    });
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  public addScene(id: string, scene: Scene) {
    this.scenes.set(id, scene);
  }

  public getScene(id: string): Scene {
    return this.scenes.get(id);
  }

  public switchScene(id: string, transition = true, done?: () => void) {
    const newScene = this.scenes.get(id);
    if (!this.current) {
      newScene.onAttach(
        transition ? ScenesManager.TRANSITION_ATTACH : null,
        transition ? ScenesManager.TRANSITION_DURATION * 2 : null,
        () => {
          this.current = newScene;
          if (typeof done === 'function') return done();
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
            if (typeof done === 'function') return done();
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

  public get scenes(): Map<string, Scene> {
    return this._scenes;
  }

  public get current(): Scene {
    return this._current;
  }

  public set current(scene: Scene) {
    this._current = scene;
  }

}