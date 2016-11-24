import Player from '../../Player';
import Vector3 from '../../Math/Vector3';
import Hotspot, { IHotspotData } from './Hotspot';
import DOM from '../../Utils/DOM';
import CSS from '../../Utils/CSS';

/* ASSETS */
const icon = require('!raw!../../../assets/icons/icon_hotspot.svg');

/** Interface defining which data is relevant for creation of a [[LinkHotspot]]. */
export interface ILinkHotspotData extends IHotspotData {
  target: string;
  rotation: number;
}

/** Class used for creating navigation nodes between scenes in scenes. */
export default class LinkHotspot extends Hotspot {

  /* DATA */
  private _target: string;
  private _rotation: number;

  /* NODES */
  private _iconNode: HTMLElement;

  /** Using supplied data either through [[LinkHotspot.fromJSON]] or arguments to create a new LinkHotspot.
   * @param _player The base player context.
   * @param _position The yaw and pitch position for the node.
   * @param _target The scene id to which it should navigate on interaction.
   * @param _rotation The rotation of the arrow icon inside the node.
   */
  constructor(
    _player: Player,
    _position?: Vector3,
    _target?: string,
    _rotation?: number
  ) {
    super(_player, _position);

    //this.node = <HTMLElement>DOM.createNode(icon);
    this._iconNode = document.createElement('i');
    this._iconNode.innerHTML = '&#10140;';

    this.target = _target || this.target || '';
    this.rotation = _rotation || this.rotation || 0;

    this.node.classList.add('link');
    this.node.appendChild(this._iconNode);
    this.node.addEventListener('click', (event: MouseEvent) => {
      this._player.scenesManager.switchScene(this.target);
    })
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /** Retrieves the scene id target for this link hotspot. */
  public get target(): string {
    return this._target;
  }

  /** Assigns a new scene id target for this link hotspot. */
  public set target(sceneId: string) {
    this._target = sceneId;
  }

  /** Retrieves the rotation for this link hotspot arrow icon. */
  public get rotation(): number {
    return this._rotation;
  }

  /** Assigns a new rotation for this link hotspot arrow icon and updates the node. */
  public set rotation(rotation: number) {
    this._rotation = rotation;
    if (this._iconNode)
      CSS.SetRules(this._iconNode, { transform: `rotate(${rotation - (Math.PI / 2)}rad)` });
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  /** Deserializes JSON data to create a new [[LinkHotspot]].
   * @param player The base player context.
   * @param json The JSON data required to create a new [[LinkHotspot]].
   * @return A new LinkHotspot from the deserialized JSON data.
   */
  static fromJSON(player: Player, json: ILinkHotspotData | string): LinkHotspot {
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