/** Interface defining which data is relevant for creation of an [[Level]]. */
export interface ILevelData {
  tileSize: number;
  size: number;
  fallbackOnly?: boolean;
}

/** Used as a data storage class exclusively */
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

  public set tileSize(size: number) {
    this._tileSize = size;
  }

  public get size(): number {
    return this._size;
  }

  public set size(size: number) {
    this._size = size;
  }

  public get fallbackOnly(): boolean {
    return this._fallbackOnly;
  }

  public set fallbackOnly(isFallback: boolean) {
    this._fallbackOnly = isFallback;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  /** Deserializes JSON data to create a new [[Level]].
   * @param json The JSON data required to create a new [[Level]].
   * @return A new Level from the deserialized JSON data.
   */
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