import Vector3 from '../../Math/Vector3';
import CorePlayer from '../../CorePlayer';

/** Hotspot interface defining publicly available properties and methods */
export interface IHotspotData {
  yaw: number;
  pitch: number;
}

/** Hotspot class for adding focus points to the CorePlayer */
export default class Hotspot {

  private _node: SVGSVGElement;

  constructor(
    private _player: CorePlayer,
    private _position?: Vector3
  ) {
    this.position = _position || new Vector3();
  }

  public get node(): SVGSVGElement {
    return this._node;
  }

  public set node(value: SVGSVGElement) {
    this._node = value;
  }

  /** Change the hotspot's position and update the dom node */
  set position(position: Vector3) {
    this._position = position;
  }

  /** Retrieve the hotspot's position */
  get position(): Vector3 {
    return this._position;
  }

  static fromJSON(player: CorePlayer, json: IHotspotData | string): Hotspot {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Hotspot.fromJSON(player, value) : value;
      });
    } else {
      return Object.assign(new Hotspot(player), json, {
        position: new Vector3(json.yaw, json.pitch),
      });
    }
  }
}