import Vector3 from '../../Math/Vector3';
import CorePlayer from '../../CorePlayer';
import DOM from '../../Utils/DOM';

/* ASSETS */
const icon = require('!raw!../../../assets/icons/icon_hotspot.svg');

/** Hotspot interface defining publicly available properties and methods */
export interface IHotspot {
  position: Vector3;
}

/** Hotspot class for adding focus points to the CorePlayer */
export default class Hotspot implements IHotspot {

  private _node: SVGSVGElement;
  private _position: Vector3;

  constructor(
    position: Vector3
  ) {
    this.position = position || new Vector3();
  }

  /** Change the hotspot's position and update the dom node */
  set position(position: Vector3) {
    this._position = position;
    this._node.style.top = position + 'px';
  }

  /** Retrieve the hotspot's position */
  get position(): Vector3 {
    return this._position;
  }
}