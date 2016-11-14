const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from './CorePlayer';
import Scene, { IScene } from './Entities/Scene';
import FS from './Utils/FS';
import WakeLockService from './Services/WakeLockService';

export default class WebVRView implements ILifeCycle {

  static LIMITER = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180);

  private _viewer: any;
  private _stage: any;
  private _wakeLockService: WakeLockService;

  private _layerLeft: any;
  private _layerRight: any;

  constructor(public player: CorePlayer) {
    this._wakeLockService = new WakeLockService();
  }

  onCreate() {
    // Insert stage into the DOM
    this._viewer = new Marzipano.Viewer(this.player.node, {
      stageType: 'webgl'
    });
    this._stage = this._viewer.stage();
    this.onResize();

    let viewLeft = new Marzipano.RectilinearView(null, WebVRView.LIMITER);
    let viewRight = new Marzipano.RectilinearView(null, WebVRView.LIMITER);

    // Create layers.
    this._layerLeft = this.createLayer(this._stage, viewLeft, this.player.sceneManager.current, 'left',
      { relativeWidth: 0.5, relativeX: 0 });
    this._layerRight = this.createLayer(this._stage, viewRight, this.player.sceneManager.current, 'right',
      { relativeWidth: 0.5, relativeX: 0.5 });

    // Add layers into stage.
    this._stage.addLayer(this._layerLeft);
    this._stage.addLayer(this._layerRight);

    // Lock the screen orientation.
    if (screen.orientation && screen.orientation.lock) {
      try {
        screen.orientation.lock('landscape');
      } catch (e) {
        console.log(e);
      }
    }

    // Prevent display from sleeping on mobile devices.
    this._wakeLockService.enable();

    return true;
  }

  onResume() {
    this._wakeLockService.enable();
  }

  onResize() {
    this._viewer.updateSize();
  }

  onPause() {
    this._wakeLockService.disable();
  }

  onDestroy() {
    this._viewer.destroy();
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  public createLayer(stage: any, view: any, scene: Scene, eye: string, rect: any) {
    //const path = FS.path(this.player.stagePath);
    const path = 'file:///Users/mnc/Git/vr-360-player/src/assets/tiles'; // @TODO TEMPORARY TEST PATH
    const source = new Marzipano.ImageUrlSource.fromString(
      `${path}/${scene.id}/${eye}/{z}/{f}/{y}/{x}.jpg`,
      { cubeMapPreviewUrl: `${path}/${scene.id}/${eye}/preview.jpg` }
    );
    let geometry = new Marzipano.CubeGeometry(scene.levels);
    const textureStore = new Marzipano.TextureStore(geometry, source, stage);
    const layer = new Marzipano.Layer(stage, source, geometry, view, textureStore,
      { effects: { rect: rect } }
    );
    layer.pinFirstLevel();

    return layer;
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------
}