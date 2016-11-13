const Marzipano = require('marzipano');

import VR360Player, { ILifeCycle } from '../VR360Player';

export default class WebVRService implements ILifeCycle {

  private _stage: any;
  private _renderLoop: any;

  constructor(public player: VR360Player) {
    // Create stage and render loop
    this._stage = new Marzipano.WebGlStage();
    this._renderLoop = new Marzipano.RenderLoop(this.stage);

    // Register renderers for stage
    Marzipano.registerDefaultRenderers(this.stage);
  }

  onCreate() {
    // Insert stage into the DOM
    this.player.node.appendChild(this.stage.domElement());
    this.onResize();

    // Start the render loop
    this._renderLoop.start();
  }

  onResume() {
    this._renderLoop.start();
  }

  onResize() {
    this.stage.updateSize();
  }

  onPause() {
    // Start the render loop
    this._renderLoop.stop();

  }

  onDestroy() {
    this._stage.destroy();
    this._renderLoop.destroy();
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  /* Marzipano WebGlStage */
  public get stage(): any {
    return this._stage;
  }
}