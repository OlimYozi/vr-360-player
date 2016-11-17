import CorePlayer from '../../CorePlayer';
import Vector3 from '../../Math/Vector3';
import Hotspot, { IHotspotData } from './Hotspot';
import DOM from '../../Utils/DOM';

/* ASSETS */
const icon = require('!raw!../../../assets/icons/icon_hotspot.svg');

export interface ILinkHotspotData extends IHotspotData {
  target: string;
  rotation: number;
}

export default class LinkHotspot extends Hotspot {

  constructor(
    _player: CorePlayer,
    _position?: Vector3,
    private _target?: string,
    private _rotation?: number
  ) {
    super(_player, _position);
    this.target = _target || '';
    this.rotation = _rotation || 0;
    this.node = <SVGSVGElement>DOM.createNode(icon);
    this.node.classList.add('hotspot');
    this.node.addEventListener('click', (event: MouseEvent) => {
      _player.sceneManager.switchScene(this.target);
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
      return Object.assign(new LinkHotspot(player), super.fromJSON(player, json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}