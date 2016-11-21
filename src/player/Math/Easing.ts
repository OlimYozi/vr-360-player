export default class Easing {

  /** No easing, no acceleration. */
  static Linear(t: number): number { return t };

  /** Accelerating from zero velocity. */
  static EaseInQuad(t: number): number { return t * t };

  /** Decelerating to zero velocity. */
  static EaseOutQuad(t: number): number { return t * (2 - t) };

  /** Acceleration until halfway, then deceleration. */
  static EaseInOutQuad(t: number): number { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t };

  /** Accelerating from zero velocity. */
  static EaseInCubic(t: number): number { return t * t * t };

  /** Decelerating to zero velocity. */
  static EaseOutCubic(t: number): number { return (--t) * t * t + 1 };

  /** Acceleration until halfway, then deceleration. */
  static EaseInOutCubic(t: number): number { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 };

  /** Accelerating from zero velocity. */
  static EaseInQuart(t: number): number { return t * t * t * t };

  /** Decelerating to zero velocity. */
  static EaseOutQuart(t: number): number { return 1 - (--t) * t * t * t };

  /** Acceleration until halfway, then deceleration. */
  static EaseInOutQuart(t: number): number { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t };

  /** Accelerating from zero velocity. */
  static EaseInQuint(t: number): number { return t * t * t * t * t };

  /** Decelerating to zero velocity. */
  static EaseOutQuint(t: number): number { return 1 + (--t) * t * t * t * t };

  /** Acceleration until halfway, then deceleration. */
  static EaseInOutQuint(t: number): number { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}