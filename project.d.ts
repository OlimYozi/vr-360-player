//------------------------------------------------------------------------------------
// EXTEND BASICS
//------------------------------------------------------------------------------------

interface Window {
  /** This method stops window loading. */
  stop();

  /** Provides web developers with information from the physical orientation of the device. */
  DeviceOrientationEvent();
}

interface Document {
  /** This method exits fullscreen mode. */
  exitFullscreen();
  /** This method exits fullscreen mode in Mozilla Firefox. */
  mozCancelFullScreen();
  /** This method exits fullscreen mode in Google Chrome and Safari. */
  webkitExitFullscreen();
  /** This method exits fullscreen mode in Internet Explorer. */
  msExitFullscreen();
}

interface Screen {
  /** Orientation object for device sensor. */
  orientation: {

    /** Locks the device screen to a specified orientation. */
    lock(orientation: string): Promise<void>;
  }
}

interface Math {
  /**
   * Returns a random value between a given maximum and minimum.
   * @param min is the lower constraint for the random number.
   * @param max is the upper constraint for the random number.
   */
  randomBetween(min: number, max: number): number;

  /**
   * Returns the value contrained by a minimum and maximum.
   * @param value which is to be contraint by the min and max.
   * @param min is the lower constraint for the value.
   * @param max is the upper constraint for the value.
   */
  clamp(value: number, min: number, max: number): number;

  /**
   * Returns a number inside a linear interpolation based on the alpha.
   * @param min is the starting value for the linear interpolation.
   * @param max is the finishing value for the linear interpolation.
   * @param alpha is the percentage at which to select the value.
   */
  lerp(min: number, max: number, alpha: number): number;
}

interface String {
  /** Capitalizes the first letter of the string. */
  capitalize(): string;
}
