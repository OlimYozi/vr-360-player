import Player from '../../Player';
import Vector3 from '../../Math/Vector3';
import Hotspot, { IHotspotData } from './Hotspot';
import DOM from '../../Utils/DOM';

/* ASSETS */
const icon = require('!raw!../../../assets/icons/icon_hotspot.svg');

/** Interface defining which data is relevant for creation of an [[InfoHotspot]]. */
export interface IInfoHotspotData extends IHotspotData {
  title: string;
  text: string;
}

/** Class used for creating information nodes in scenes. */
export default class InfoHotspot extends Hotspot {

  /* DATA */
  private _title: string;
  private _text: string;

  /* NODES */
  private _iconNode: HTMLElement;
  private _titleNode: HTMLElement;
  private _textNode: HTMLElement;

  /** Using supplied data either through [[InfoHotspot.fromJSON]] or arguments to create a new InfoHotspot.
   * @param _player The base player context.
   * @param _position The yaw and pitch position for the node.
   * @param _title The title to display inside the expanded state.
   * @param _text The text description to display inside the expanded state.
   */
  constructor(
    _player: Player,
    _position?: Vector3,
    _title?: string,
    _text?: string
  ) {
    super(_player, _position);

    //this._iconNode = <HTMLElement>DOM.createNode(icon);
    this._iconNode = document.createElement('i');
    this._iconNode.innerHTML = 'i';

    this._titleNode = document.createElement('h3');
    this._titleNode.innerHTML = this.title;

    this._textNode = document.createElement('p');
    this._textNode.innerHTML = this.text;

    this.title = _title || this.title || '';
    this.text = _text || this.text || '';

    // Bind event handlers
    this.onClick = this.onClick.bind(this);

    this.node.classList.add('info');
    this.node.appendChild(this._iconNode);
    this.node.appendChild(this._titleNode);
    this.node.appendChild(this._textNode);
    this.node.addEventListener('click', this.onClick);
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    this._node.removeEventListener('click', this.onClick);
    this._iconNode = null;
    this._titleNode = null;
    this._textNode = null;
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  protected onClick(event: MouseEvent) {
    if (this.node.classList.contains('active'))
      this.node.classList.remove('active');
    else
      this.node.classList.add('active');
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /** Retrieves the title for this info hotspot */
  public get title(): string {
    return this._title;
  }

  /** Assigns a new title to this info hotspot and updates the node. */
  public set title(title: string) {
    this._title = title;
    if (this._titleNode)
      this._titleNode.innerHTML = title;
  }

  /** Retrieves the text description for this info hotspot. */
  public get text(): string {
    return this._text;
  }

  /** Assigns a new text description to this info hotspot and updates the node. */
  public set text(text: string) {
    this._text = text;
    if (this._textNode)
      this._textNode.innerHTML = text;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  /** Deserializes JSON data to create a new [[InfoHotspot]].
   * @param player The base player context.
   * @param json The JSON data required to create a new [[InfoHotspot]].
   * @return A new InfoHotspot from the deserialized JSON data.
   */
  static fromJSON(player: Player, json: IInfoHotspotData | string): InfoHotspot {
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