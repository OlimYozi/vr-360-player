import CorePlayer from '../../CorePlayer';
import Vector3 from '../../Math/Vector3';
import Hotspot, { IHotspotData } from './Hotspot';
import DOM from '../../Utils/DOM';

/* ASSETS */
const icon = require('!raw!../../../assets/icons/icon_hotspot.svg');

export interface IInfoHotspotData extends IHotspotData {
  title: string;
  text: string;
}

export default class InfoHotspot extends Hotspot {

  private _title: string;
  private _text: string;

  constructor(
    _player: CorePlayer,
    _position?: Vector3,
    _title?: string,
    _text?: string
  ) {
    super(_player, _position);
    this.title = _title || this.title || '';
    this.text = _text || this.text || '';

    //this.node = <HTMLElement>DOM.createNode(icon);
    this.node.classList.add('info');

    const icon = document.createElement('i');
    icon.innerHTML = '&#x2139;';

    const title = document.createElement('h3');
    title.innerHTML = this.title;

    const text = document.createElement('p');
    text.innerHTML = this.text;

    this.node.appendChild(icon);
    this.node.appendChild(title);
    this.node.appendChild(text);
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------


  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    this._text = value;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(player: CorePlayer, json: IInfoHotspotData | string): InfoHotspot {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? InfoHotspot.fromJSON(player, value) : value;
      });
    } else {
      const hotspot = Object.assign(Object.create(InfoHotspot.prototype), super.fromJSON(player, json), {
        // Special Cases Object.fromJSON(json.object);
      });
      InfoHotspot.apply(hotspot);
      return hotspot;
    }
  }
}