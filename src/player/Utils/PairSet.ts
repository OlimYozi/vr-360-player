export default class PairSet<T> {

  private _primary: T;
  private _secondary: T;

  constructor(
    primary?: T,
    secondary?: T
  ) {
    this._primary = primary;
    this._secondary = secondary;
  }

  //------------------------------------------------------------------------------------
  // METHOD
  //------------------------------------------------------------------------------------

  public pair(callback: (entry: T) => void) {
    callback(this.primary);
    callback(this.secondary);
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public set primary(primary: T) {
    this._primary = primary;
  }

  public get primary(): T {
    return this._primary;
  }

  public set secondary(secondary: T) {
    this._secondary = secondary;
  }
  public get secondary(): T {
    return this._secondary;
  }
}