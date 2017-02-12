const Marzipano = require('marzipano');
import Vector4 from '../Math/Vector4';

/** Custom control method to alter the view according to the device orientation. */
export default class DeviceOrientationService {

  private _events = {};

  private _dynamics: any;

  private _previous: Vector4;
  private _current: Vector4;
  private _tmp: Vector4;

  private _getPitchCallbacks = [];

  constructor() {
    this._dynamics = {
      yaw: new Marzipano.Dynamics(),
      pitch: new Marzipano.Dynamics()
    };

    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.onDeviceOrientation);
    }

    this._previous = new Vector4();
    this._current = new Vector4();
    this._tmp = new Vector4();
  }

  destroy() {
    this._dynamics = null;
    if (window.DeviceOrientationEvent) {
      window.removeEventListener('deviceorientation', this.onDeviceOrientation);
    }
    this.onDeviceOrientation = null;
    this._previous = null;
    this._current = null;
    this._tmp = null;
    this._getPitchCallbacks = null;
  }

  getPitch(cb: (err: any, data: any) => void) {
    this._getPitchCallbacks.push(cb);
  }

  private onDeviceOrientation(event: DeviceOrientationEvent) {
    if (event.alpha === null || event.beta === null || event.gamma === null)
      return;

    const previous = this._previous;
    const current = this._current;
    const tmp = this._tmp;

    tmp.yaw = Marzipano.util.degToRad(event.alpha);
    tmp.pitch = Marzipano.util.degToRad(event.beta);
    tmp.roll = Marzipano.util.degToRad(event.gamma);

    DeviceOrientationService.rotateEuler(tmp, current);

    // Report current pitch value.
    this._getPitchCallbacks.forEach(callback => {
      callback(null, current.pitch);
    });
    this._getPitchCallbacks.length = 0;

    // Emit control offsets.
    if (previous.yaw !== null && previous.pitch !== null && previous.roll !== null) {
      this._dynamics.yaw.offset = -(current.yaw - previous.yaw);
      this._dynamics.pitch.offset = (current.pitch - previous.pitch);

      this.emit('parameterDynamics', 'yaw', this._dynamics.yaw);
      this.emit('parameterDynamics', 'pitch', this._dynamics.pitch);
    }

    previous.yaw = current.yaw;
    previous.pitch = current.pitch;
    previous.roll = current.roll;
  }

  /** Add a new EventListener */
  public addEventListener(event: string, fn: (event: string, target: string, value: any) => void) {
    var handlerList = this._events[event] = this._events[event] || [];
    handlerList.push(fn);
  };

  /** Remove an added EventListener */
  public removeEventListener(event: string, fn: (event: string, target: any, value: any) => void) {
    var handlerList = this._events[event];
    if (handlerList) {
      var index = handlerList.indexOf(fn);
      if (index >= 0) {
        handlerList.splice(index, 1);
      }
    }
  };

  /** Emit a new event */
  public emit(event: string, target: string, value: any) {
    var handlerList = this._events[event];
    if (handlerList) {
      for (var i = 0; i < handlerList.length; i++) {
        var fn = handlerList[i];
        fn.apply(this, [event, target, value]);
      }
    }
  };

  /**
   * Taken from krpano's gyro plugin by Aldo Hoeben:
   * https://github.com/fieldOfView/krpano_fovplugins/tree/master/gyro/
   * For the math, see references:
   * http://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToMatrix/index.htm
   * http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToEuler/index.htm
   */
  static rotateEuler(euler: Vector4, result?: Vector4): Vector4 {
    result = result || new Vector4();
    let heading; // Includes 90-degree rotation around z axis
    let bank;
    let attitude;
    const ch = Math.cos(euler.yaw);
    const sh = Math.sin(euler.yaw);
    const ca = Math.cos(euler.pitch);
    const sa = Math.sin(euler.pitch);
    const cb = Math.cos(euler.roll);
    const sb = Math.sin(euler.roll);

    const matrix = [
      sh * sb - ch * sa * cb, -ch * ca, ch * sa * sb + sh * cb,
      ca * cb, -sa, -ca * sb,
      sh * sa * cb + ch * sb, sh * ca, -sh * sa * sb + ch * cb
    ];

    if (matrix[3] > 0.9999) {
      // Deal with singularity at north pole
      heading = Math.atan2(matrix[2], matrix[8]);
      attitude = Math.PI / 2;
      bank = 0;
    }
    else if (matrix[3] < -0.9999) {
      // Deal with singularity at south pole
      heading = Math.atan2(matrix[2], matrix[8]);
      attitude = -Math.PI / 2;
      bank = 0;
    }
    else {
      heading = Math.atan2(-matrix[6], matrix[0]);
      bank = Math.atan2(-matrix[5], matrix[4]);
      attitude = Math.asin(matrix[3]);
    }

    result.yaw = heading;
    result.pitch = attitude;
    result.roll = bank;
    return result;
  }
}