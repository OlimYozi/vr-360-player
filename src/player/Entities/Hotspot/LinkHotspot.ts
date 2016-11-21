import CorePlayer from '../../CorePlayer';
import Vector3 from '../../Math/Vector3';
import Hotspot, { IHotspotData } from './Hotspot';
import DOM from '../../Utils/DOM';
import CSS from '../../Utils/CSS';

/* ASSETS */
const icon = require('!raw!../../../assets/icons/icon_hotspot.svg');

export interface ILinkHotspotData extends IHotspotData {
  target: string;
  rotation: number;
}

export default class LinkHotspot extends Hotspot {

  private _target: string;
  private _rotation: number;

  constructor(
    _player: CorePlayer,
    _position?: Vector3,
    _target?: string,
    _rotation?: number
  ) {
    super(_player, _position);
    this.target = _target || this.target || '';
    this.rotation = _rotation || this.rotation || 0;

    //this.node = <HTMLElement>DOM.createNode(icon);
    this.node.classList.add('link');

    const icon = document.createElement('i');
    icon.innerHTML = '&#10140;';
    CSS.SetRules(icon, { transform: `rotate(${this.rotation - (Math.PI / 2)}rad)` });

    this.node.appendChild(icon);
    this.node.addEventListener('click', (event: MouseEvent) => {
      this._player.sceneManager.switchScene(this.target);
    })
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

  static fromJSON(player: CorePlayer, json: ILinkHotspotData | string): LinkHotspot {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? LinkHotspot.fromJSON(player, value) : value;
      });
    } else {
      const hotspot = Object.assign(Object.create(LinkHotspot.prototype), super.fromJSON(player, json), {
        // Special Cases Object.fromJSON(json.object);
      });
      LinkHotspot.apply(hotspot);
      return hotspot;
    }
  }
}