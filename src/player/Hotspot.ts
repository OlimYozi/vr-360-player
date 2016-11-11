export interface IHotspot {
  pitch: number,
}

export default class Hotspot implements IHotspot {

  private _node: HTMLElement;

  constructor(
    private _pitch?: number,
    private _yaw?: number
  ) {
    this._pitch = _pitch || 0;
    this._yaw = _yaw || 0;

    this._node = document.createElement('a');
    this._node.className = 'hotspot';
    document.body.appendChild(this._node);
  }

  set pitch(pitch: number) {
    this._pitch = pitch;
    this._node.style.top = pitch + 'px';
  }

  get pitch(): number {
    return this._pitch;
  }
}