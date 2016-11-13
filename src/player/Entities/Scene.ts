import Vector3 from '../Math/Vector3';
import Level from './Level';
import LinkHotspot from './Hotspot/LinkHotspot';
import InfoHotspot from './Hotspot/InfoHotspot';

export interface IScene {
  id: string;
  name: string;
  levels: Level[];
  faceSize: number;
  initialViewParameters: Vector3;
  linkHotspots: LinkHotspot[];
  infoHotspots: InfoHotspot[];
}

export default class Scene implements IScene {

  private _levels: Level[];

  constructor() {

  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get levels(): Level[] {
    return this._levels;
  }

  public set levels(value: Level[]) {
    this._levels = value;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IScene | string): Scene {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Scene.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Scene.prototype), json, {
        levels: json.levels.map(level => Level.fromJSON(level)),
        initialViewParameters: Vector3.fromJSON(json.initialViewParameters),
        linkHotspots: json.linkHotspots.map(hotspot => LinkHotspot.fromJSON(hotspot)),
        infoHotspots: json.infoHotspots.map(hotspot => InfoHotspot.fromJSON(hotspot)),
      });
    }
  }
}