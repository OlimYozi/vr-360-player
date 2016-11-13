import Vector3 from '../../Math/Vector3';
import Hotspot, { IHotspot } from './Hotspot';

export interface IInfoHotspot extends IHotspot {
  title: string;
  text: string;
}

export default class InfoHotspot extends Hotspot implements IInfoHotspot {

  constructor(
    position: Vector3,
    private _title: string,
    private _text?: string
  ) {
    super(position);
    this.title = _title || '';
    this.text = _text || '';
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

  static fromJSON(json: IInfoHotspot | string): InfoHotspot {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? InfoHotspot.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(InfoHotspot.prototype), json, {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}