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

  private _id: string;
  private _name: string;
  private _levels: Level[];
  private _faceSize: number;
  private _initialViewParameters: Vector3;
  private _linkHotspots: LinkHotspot[];
  private _infoHotspots: InfoHotspot[];

  constructor(
    id: string
  ) {
    this.id = id;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get levels(): Level[] {
    return this._levels;
  }

  public set levels(value: Level[]) {
    this._levels = value;
  }

  public get initialViewParameters(): Vector3 {
    return this._initialViewParameters;
  }

  public set initialViewParameters(value: Vector3) {
    this._initialViewParameters = value;
  }

  public get faceSize(): number {
    return this._faceSize;
  }

  public set faceSize(value: number) {
    this._faceSize = value;
  }

  public get linkHotspots(): LinkHotspot[] {
    return this._linkHotspots;
  }

  public set linkHotspots(value: LinkHotspot[]) {
    this._linkHotspots = value;
  }

  public get infoHotspots(): InfoHotspot[] {
    return this._infoHotspots;
  }

  public set infoHotspots(value: InfoHotspot[]) {
    this._infoHotspots = value;
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