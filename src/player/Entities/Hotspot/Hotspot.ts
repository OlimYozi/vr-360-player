const Marzipano = require('marzipano');

import Vector4 from '../../Math/Vector4';
import Player from '../../Player';

/** Interface defining which data is relevant for creation of an [[Hotspot]]. */
export interface IHotspotData {
  yaw: number;
  pitch: number;
}

/** Base class used for focus nodes in scenes. */
export default class Hotspot {

  static EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel'];

  protected _player: Player;
  protected _position: Vector4;
  protected _node: HTMLElement;

  /** Using supplied data either through [[Hotspot.fromJSON]] or arguments to create a new Hotspot.
   * @param _player The base player context.
   * @param _position The yaw and pitch position for the node.
   */
  constructor(
    _player?: Player,
    _position?: Vector4
  ) {
    this.node = document.createElement('div');
    this.node.classList.add('hotspot');

    this._player = _player || this._player || null;
    this.position = _position || this._position || new Vector4();

    // Bind event handlers
    this.onPropagationStop = this.onPropagationStop.bind(this);

    Hotspot.EVENTS.forEach((event: string) => {
      this.node.addEventListener(event, this.onPropagationStop);
    });
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    Hotspot.EVENTS.forEach((event: string) => {
      this.node.removeEventListener(event, this.onPropagationStop);
    });
    this._player = null;
    this._node = null;
    this._position = null;
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  protected onPropagationStop(event: any) {
    event.stopPropagation();
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /** Retrieves the node for this hotspot. */
  public get node(): HTMLElement {
    return this._node;
  }

  /** Assigns a new node to this hotspot. */
  public set node(value: HTMLElement) {
    this._node = value;
  }

  /** Assigns a new yaw and pitch position to this hotspot and updates the node. */
  set position(position: Vector4) {
    this._position = position;
  }

  /** Retrieves the yaw and pitch position for this hotspot. */
  get position(): Vector4 {
    return this._position;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  /** Deserializes JSON data to create a new [[Hotspot]].
   * @param player The base player context.
   * @param json The JSON data required to create a new [[Hotspot]].
   * @return A new Hotspot from the deserialized JSON data.
   */
  static fromJSON(player: Player, json: IHotspotData | string): Hotspot {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Hotspot.fromJSON(player, value) : value;
      });
    } else {
      const hotspot = Object.assign(Object.create(Hotspot.prototype), json, {
        _player: player,
        position: new Vector4(json.yaw, json.pitch),
      });
      Hotspot.apply(hotspot);
      return hotspot;
    }
  }
}