export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export default class Vector3 {

  constructor(
    private _x?: number,
    private _y?: number,
    private _z?: number
  ) {
    this.x = _x || 0;
    this.y = _y || 0;
    this.z = _z || 0;
  }

  //------------------------------------------------------------------------------------
  // MAIN
  //------------------------------------------------------------------------------------

  equals(vector: Vector3): boolean {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }

  toString(): string {
    return `vec3:(${this.x}, ${this.y}, ${this.z})`;
  }

  get magnitude(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  get normal(): number {
    return Math.sqrt(this.magnitude);
  }

  get array(): Array<number> {
    return [this.x, this.y, this.z];
  }

  //------------------------------------------------------------------------------------
  // BASIC ARITHMETICS
  //------------------------------------------------------------------------------------

  add(vector: Vector3): Vector3 {
    return new Vector3(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z
    );
  }

  subtract(vector: Vector3): Vector3 {
    return new Vector3(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z
    );
  }

  multiply(vector: Vector3): Vector3 {
    return new Vector3(
      this.x * vector.x,
      this.y * vector.y,
      this.z * vector.z
    );
  }

  divide(vector: Vector3): Vector3 {
    return new Vector3(
      (vector.x === 0 ? 0 : this.x / vector.x),
      (vector.y === 0 ? 0 : this.y / vector.y),
      (vector.z === 0 ? 0 : this.z / vector.z)
    );
  }

  scale(scalar: number): Vector3 {
    return new Vector3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
  }

  angle(vector: Vector3): number {
    return Math.acos(this.dot(vector) / (this.normal * vector.normal));
  }

  dot(vector: Vector3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector: Vector3): Vector3 {
    return new Vector3(
      (this.y * vector.z) - (this.z * vector.y),
      (this.z * vector.x) - (this.x * vector.z),
      (this.x * vector.y) - (this.y * vector.x),
    );
  }

  distance(vector: Vector3): number {
    var dx: number = this.x - vector.x,
      dy: number = this.y - vector.y,
      dz: number = this.z - vector.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  negate(): Vector3 {
    return new Vector3(
      -1 * Math.abs(this.x),
      -1 * Math.abs(this.y),
      -1 * Math.abs(this.z)
    );
  }

  abs(): Vector3 {
    return new Vector3(
      Math.abs(this.x),
      Math.abs(this.y),
      Math.abs(this.z)
    );
  }

  reflect(): Vector3 {
    return new Vector3(
      -1 * this.x,
      -1 * this.y,
      -1 * this.z
    );
  }

  lerp(vector: Vector3, amount: number): Vector3 {
    return this.add(vector.subtract(this).scale(amount));
  }

  //------------------------------------------------------------------------------------
  // STATIC FUNCTIONS
  //------------------------------------------------------------------------------------

  static max(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(
      (a.x > b.x ? a.x : b.x),
      (a.y > b.y ? a.y : b.y),
      (a.z > b.z ? a.z : b.z)
    );
  }

  static min(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(
      (a.x < b.x ? a.x : b.x),
      (a.y < b.y ? a.y : b.y),
      (a.z < b.z ? a.z : b.z)
    );
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS FOR X, Y, Z
  //------------------------------------------------------------------------------------

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get z(): number {
    return this._z;
  }

  set x(x: number) {
    this._x = x;
  }

  set y(y: number) {
    this._y = y;
  }

  set z(z: number) {
    this._z = z;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS FOR YAW, PITCH, ROLL
  //------------------------------------------------------------------------------------

  get yaw(): number {
    return this._x;
  }

  get pitch(): number {
    return this._y;
  }

  get roll(): number {
    return this._z;
  }

  set yaw(x: number) {
    this._x = x;
  }

  set pitch(y: number) {
    this._y = y;
  }

  set roll(z: number) {
    this._z = z;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS FOR RED, GREEN, BLUE
  //------------------------------------------------------------------------------------

  get r(): number {
    return this._x;
  }

  get g(): number {
    return this._y;
  }

  get b(): number {
    return this._z;
  }

  set r(x: number) {
    this._x = x;
  }

  set g(y: number) {
    this._y = y;
  }

  set b(z: number) {
    this._z = z;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(json: IVector3 | string): Vector3 {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Vector3.fromJSON(value) : value;
      });
    } else {
      return Object.assign(Object.create(Vector3.prototype), json, {
        // Special Cases Object.fromJSON(json.object);
      });
    }
  }
}