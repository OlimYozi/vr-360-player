const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from './CorePlayer';
import Mode from './Mode';
import Scene, { ISceneData } from './Entities/Scene';
import FS from './Utils/FS';

export default class PanoramaMode extends Mode implements ILifeCycle {

  constructor(protected _player: CorePlayer) {
    super(_player);
  }

  onCreate() {
    super.onCreate();

    // Exit fullscreen if active on launch
    this._player.exitFullscreen();

    // Show controls if hidden
    this._player.controlsManager.showControls();

    this.onResize();
  }

  onResume() {
    super.onResume();
  }

  onResize() {
    super.onResize();
  }

  onPause() {
    super.onPause();
  }

  onDestroy() {
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

}