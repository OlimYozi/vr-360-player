export interface ILevel {
  tileSize: number;
  size: number;
  fallbackOnly?: boolean;
}

export default class Level implements ILevel {

  constructor(
    public tileSize: number,
    public size: number,
    public fallbackOnly?: boolean,
  ) { }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: ILevel | string): Level {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Level.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Level.prototype), json, {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}