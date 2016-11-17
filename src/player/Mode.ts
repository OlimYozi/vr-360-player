const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from './CorePlayer';

export default class Mode implements ILifeCycle {

  private _viewer: any;

  constructor(public player: CorePlayer) {
  }

  onCreate() {
    return true;
  }

  onResume() {
  }

  onResize() {
  }

  onPause() {
  }

  onDestroy() {
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------
}