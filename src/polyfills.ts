import 'core-js/es6';

Math.randomBetween = function (min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
};

Math.clamp = function (value: number, min: number, max: number): number {
  return this.max(min, this.min(value, max));
};

Math.lerp = function (min: number, max: number, alpha: number): number {
  return min * (1 - alpha) + max * alpha;
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}