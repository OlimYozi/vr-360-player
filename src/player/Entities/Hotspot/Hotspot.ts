const Marzipano = require('marzipano');

import Vector3 from '../../Math/Vector3';
import CorePlayer from '../../CorePlayer';

/** Hotspot interface defining publicly available properties and methods */
export interface IHotspotData {
  yaw: number;
  pitch: number;
}

/** Hotspot class for adding focus points to the CorePlayer */
export default class Hotspot {

  protected _player: CorePlayer;
  protected _position: Vector3;
  protected _node: HTMLElement;

  constructor(
    _player?: CorePlayer,
    _position?: Vector3
  ) {
    this._player = _player || this._player || null;
    this.position = _position || this._position || new Vector3();
    this.node = document.createElement('div');
    this.node.classList.add('hotspot');

    const eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel'];
    eventList.forEach((event: string) => {
      this.node.addEventListener(event, function (event) {
        event.stopPropagation();
      });
    })
  }

  public get node(): HTMLElement {
    return this._node;
  }

  public set node(value: HTMLElement) {
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
      const hotspot = Object.assign(Object.create(Hotspot.prototype), json, {
        _player: player,
        position: new Vector3(json.yaw, json.pitch),
      });
      Hotspot.apply(hotspot);
      return hotspot;
    }
  }
}