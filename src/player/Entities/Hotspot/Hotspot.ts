import Vector3 from '../../Math/Vector3';
import VR360Player from '../../VR360Player';

/* UTILS */
import DOM from '../../Utils/DOM';

/* ASSETS */
const icon = require('!raw!../assets/icons/icon_hotspot.svg');

/* Hotspot interface defining publicly available properties and methods */
export interface IHotspot {
  position: Vector3;
}

/* Hotspot class for adding focus points to the VR360Player */
export default class Hotspot implements IHotspot {

  private _node: SVGSVGElement;

  constructor(
    private _position: Vector3
  ) {
  }

  /* Change the hotspots' position and update the dom node */
  set position(position: Vector3) {
    this._position = position;
    this._node.style.top = position + 'px';
  }

  /* Retrieve the hotspots' position */
  get position(): Vector3 {
    return this._position;
  }
}