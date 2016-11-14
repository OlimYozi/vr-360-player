import HTTP from '../Utils/HTTP';
import Scene, { IScene } from '../Entities/Scene';

export interface IStageJSON {
  scenes: Scene[];
  name: string;
  settings: {
    autorotateEnabled: boolean,
  }
}

export default class SceneManager {

  private _scenes = new Map<string, Scene>();
  private _autoRotate = false;
  private _current: Scene;

  constructor() {
  }

  public load(json: string) {
    let data = <IStageJSON>JSON.parse(json);
    data.scenes.forEach((scene: IScene) => {
      this.addScene(scene.id, Scene.fromJSON(scene));
    });
    this.current = this.getScene(data.scenes[0].id);
    this.autoRotate = data.settings.autorotateEnabled;
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

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get scenes(): Map<string, Scene> {
    return this._scenes;
  }

  public get autoRotate(): boolean {
    return this._autoRotate;
  }

  public set autoRotate(value: boolean) {
    this._autoRotate = value;
  }

  public get current(): Scene {
    return this._current;
  }

  public set current(value: Scene) {
    this._current = value;
  }

}