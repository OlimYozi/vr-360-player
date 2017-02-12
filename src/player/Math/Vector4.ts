export default class Vector4 {

  constructor(
    private _x?: number,
    private _y?: number,
    private _z?: number,
    private _w?: number
  ) {
    this.x = _x || 0;
    this.y = _y || 0;
    this.z = _z || 0;
    this.w = _w || 0;
  }

  //------------------------------------------------------------------------------------
  // MAIN
  //------------------------------------------------------------------------------------

  equals(vector: Vector4): boolean {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z && this.w === vector.w;
  }

  toString(): string {
    return `vec3:(${this.x}, ${this.y}, ${this.z}), ${this.w})`;
  }

  get magnitude(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  get normal(): number {
    return Math.sqrt(this.magnitude);
  }

  get array(): Array<number> {
    return [this.x, this.y, this.z, this.w];
  }

  //------------------------------------------------------------------------------------
  // BASIC ARITHMETICS
  //------------------------------------------------------------------------------------

  add(vector: Vector4): Vector4 {
    return new Vector4(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z,
      this.w + vector.w
    );
  }

  subtract(vector: Vector4): Vector4 {
    return new Vector4(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z,
      this.w - vector.w
    );
  }

  multiply(vector: Vector4): Vector4 {
    return new Vector4(
      this.x * vector.x,
      this.y * vector.y,
      this.z * vector.z,
      this.w * vector.w
    );
  }

  divide(vector: Vector4): Vector4 {
    return new Vector4(
      (vector.x === 0 ? 0 : this.x / vector.x),
      (vector.y === 0 ? 0 : this.y / vector.y),
      (vector.z === 0 ? 0 : this.z / vector.z),
      (vector.w === 0 ? 0 : this.w / vector.w)
    );
  }

  scale(scalar: number): Vector4 {
    return new Vector4(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
      this.w * scalar
    );
  }

  angle(vector: Vector4): number {
    return Math.acos(this.dot(vector) / (this.normal * vector.normal));
  }

  dot(vector: Vector4): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
  }

  cross(vector: Vector4): Vector4 {
    return new Vector4(
      (this.y * vector.z) - (this.z * vector.y),
      (this.z * vector.x) - (this.x * vector.z),
      (this.x * vector.y) - (this.y * vector.x)
    );
  }

  distance(vector: Vector4): number {
    var dx: number = this.x - vector.x,
      dy: number = this.y - vector.y,
      dz: number = this.z - vector.z,
      dw: number = this.w - vector.w;

    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
  }

  negate(): Vector4 {
    return new Vector4(
      -1 * Math.abs(this.x),
      -1 * Math.abs(this.y),
      -1 * Math.abs(this.z),
      -1 * Math.abs(this.w)
    );
  }

  abs(): Vector4 {
    return new Vector4(
      Math.abs(this.x),
      Math.abs(this.y),
      Math.abs(this.z),
      Math.abs(this.w)
    );
  }

  reflect(): Vector4 {
    return new Vector4(
      -1 * this.x,
      -1 * this.y,
      -1 * this.z,
      -1 * this.w
    );
  }

  lerp(vector: Vector4, amount: number): Vector4 {
    return this.add(vector.subtract(this).scale(amount));
  }

  //------------------------------------------------------------------------------------
  // STATIC FUNCTIONS
  //------------------------------------------------------------------------------------

  static max(a: Vector4, b: Vector4): Vector4 {
    return new Vector4(
      (a.x > b.x ? a.x : b.x),
      (a.y > b.y ? a.y : b.y),
      (a.z > b.z ? a.z : b.z),
      (a.w > b.w ? a.w : b.w)
    );
  }

  static min(a: Vector4, b: Vector4): Vector4 {
    return new Vector4(
      (a.x < b.x ? a.x : b.x),
      (a.y < b.y ? a.y : b.y),
      (a.z < b.z ? a.z : b.z),
      (a.w < b.w ? a.w : b.w)
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

  get w(): number {
    return this._w;
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

  set w(w: number) {
    this._w = w;
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

  get fov(): number {
    return this._w;
  }

  set yaw(yaw: number) {
    this._x = yaw;
  }

  set pitch(pitch: number) {
    this._y = pitch;
  }

  set roll(roll: number) {
    this._z = roll;
  }

  set fov(fov: number) {
    this._w = fov;
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

  get a(): number {
    return this._w;
  }

  set r(r: number) {
    this._x = r;
  }

  set g(g: number) {
    this._y = g;
  }

  set b(b: number) {
    this._z = b;
  }

  set a(a: number) {
    this._w = a;
  }
}