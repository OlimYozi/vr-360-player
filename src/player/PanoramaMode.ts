const Marzipano = require('marzipano');

import Player, { ILifeCycle } from './Player';
import Mode from './Mode';
import Scene, { ISceneData } from './Entities/Scene';
import FS from './Utils/FS';

/** Class used for enabling the panoramic mode in the player. This is a simple 360 degree view used for computers. */
export default class PanoramaMode extends Mode implements ILifeCycle {

  /** Contructor initializer, however does not create anything until the [[onCreate]] method is called.
   * @param _player The base player context.
   */
  constructor(protected _player: Player) {
    super(_player);
  }

  /** Called after the constructor to create variables that later need to be disposed.
   * Also exits fullscreen and shows controllers
   */
  onCreate() {
    super.onCreate();

    // Exit fullscreen if active on launch
    this._player.exitFullscreen();

    // Show controls if hidden
    this._player.controlsManager.showControls();

    this.onResize();
  }

  /** Called when window is focused after blur. */
  onResume() {
    super.onResume();
  }

  /** Called when window viewport size changes. */
  onResize() {
    super.onResize();
  }

  /** Called when window is blurred after focus. */
  onPause() {
    super.onPause();
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    super.onDestroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

}