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

  constructor(
    _player: CorePlayer,
    _position?: Vector3,
    private _title?: string,
    private _text?: string
  ) {
    super(_player, _position);
    this.title = _title || '';
    this.text = _text || '';
    this.node = <SVGSVGElement>DOM.createNode(icon);
    this.node.classList.add('hotspot');
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
      return Object.assign(new InfoHotspot(player), super.fromJSON(player, json), {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}