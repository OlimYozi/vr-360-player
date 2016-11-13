import Vector3 from '../../Math/Vector3';
import Hotspot, { IHotspot } from './Hotspot';

export interface ILinkHotspot extends IHotspot {
  target: string;
  rotation: number;
}

export default class LinkHotspot extends Hotspot implements ILinkHotspot {

  constructor(
    position: Vector3,
    private _target: string,
    private _rotation?: number
  ) {
    super(position);
    this.target = _target || '';
    this.rotation = _rotation || 0;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------


  public get target(): string {
    return this._target;
  }

  public set target(value: string) {
    this._target = value;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(value: number) {
    this._rotation = value;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: ILinkHotspot | string): LinkHotspot {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? LinkHotspot.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(LinkHotspot.prototype), json, {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}