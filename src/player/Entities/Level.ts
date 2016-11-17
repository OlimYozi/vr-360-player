export interface ILevelData {
  tileSize: number;
  size: number;
  fallbackOnly?: boolean;
}

export default class Level {

  constructor(
    private _tileSize?: number,
    private _size?: number,
    private _fallbackOnly?: boolean
  ) {
    this.tileSize = _tileSize || 512;
    this.size = _size || 512;
    this.fallbackOnly = _fallbackOnly || false;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get tileSize(): number {
    return this._tileSize;
  }

  public set tileSize(value: number) {
    this._tileSize = value;
  }

  public get size(): number {
    return this._size;
  }

  public set size(value: number) {
    this._size = value;
  }

  public get fallbackOnly(): boolean {
    return this._fallbackOnly;
  }

  public set fallbackOnly(value: boolean) {
    this._fallbackOnly = value;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: ILevelData | string): Level {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Level.fromJSON(value) : value;
      });
    } else {
      return Object.assign(new Level(), json, {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}