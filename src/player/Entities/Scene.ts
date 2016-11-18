const Marzipano = require('marzipano');

import CorePlayer, { ILifeCycle } from '../CorePlayer';
import PanoramaMode from '../PanoramaMode';
import StereoscopicMode from '../StereoscopicMode';
import Vector3 from '../Math/Vector3';
import Level from './Level';
import LinkHotspot, { ILinkHotspotData } from './Hotspot/LinkHotspot';
import InfoHotspot, { IInfoHotspotData } from './Hotspot/InfoHotspot';

export interface ISceneData {
  id: string;
  name: string;
  levels: Level[];
  faceSize: number;
  initialViewParameters: Vector3;
  linkHotspots: ILinkHotspotData[];
  infoHotspots: IInfoHotspotData[];
}

export default class Scene implements ILifeCycle {

  //static LIMITER = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180);
  static LIMITER = Marzipano.util.compose(
    Marzipano.RectilinearView.limit.vfov(90 * Math.PI / 180, 90 * Math.PI / 180),
    Marzipano.RectilinearView.limit.hfov(90 * Math.PI / 180, 90 * Math.PI / 180),
    Marzipano.RectilinearView.limit.pitch(-Math.PI / 2, Math.PI / 2));

  private _id: string;
  private _name: string;
  private _levels: Level[];
  private _faceSize: number;
  private _initialViewParameters: Vector3;
  private _linkHotspots: LinkHotspot[];
  private _infoHotspots: InfoHotspot[];

  private _geometry: any;
  private _view: any;
  private _hotspotContainer: any;
  private _sources: any[];
  private _textureStores: any[];
  private _layers: any[];

  constructor(
    private _player: CorePlayer,
  ) {
    this._sources = [];
    this._textureStores = [];
    this._layers = [];
  }

  onCreate(): boolean {
    this._geometry = new Marzipano.CubeGeometry(this.levels);
    this._view = new Marzipano.RectilinearView(null, Scene.LIMITER);

    this.createLayer(this._player.viewer.stage(), 'left', { relativeWidth: 0.5, relativeX: 0 });
    this.createLayer(this._player.viewer.stage(), 'right', { relativeWidth: 0.5, relativeX: 0.5 });

    this._hotspotContainer = new Marzipano.HotspotContainer(
      this._player.viewer._controlContainer,
      this._player.viewer.stage(),
      this._view,
      this._player.viewer.renderLoop(),
      { rect: this._layers[0].effects().rect }
    );

    this._linkHotspots.forEach((hotspot: LinkHotspot) => {
      this._hotspotContainer.createHotspot(hotspot.node, hotspot.position);
    })
    this._infoHotspots.forEach((hotspot: InfoHotspot) => {
      this._hotspotContainer.createHotspot(hotspot.node, hotspot.position);
    })
    return true;
  }

  onAttach() {
    const stage = this._player.viewer.stage();
    stage.addLayer(this._layers[0]);

    if (this._player.mode instanceof PanoramaMode) {
      this._layers[0].setEffects({ rect: { relativeWidth: 1 } });
      this.setEye('left');
    } else {
      this._layers[0].setEffects({ rect: { relativeWidth: 0.5 } });
      stage.addLayer(this._layers[1]);
      this.setEye((<StereoscopicMode>this._player.mode).dominantEye);
    }
    this._hotspotContainer.show();
  }

  onResume() {
  }

  onResize() {
  }

  onDetatch(done?: () => void) {
    const stage = this._player.viewer.stage();
    stage.removeLayer(this._layers[0]);

    if (stage.hasLayer(this._layers[1]))
      stage.removeLayer(this._layers[1]);

    this._hotspotContainer.hide();
    if (done) done();
  }

  onPause() {
  }

  onDestroy() {
    for (var i = 0; i < this._layers.length; i++) {
      this._view.destroy();
      this._textureStores[i].destroy();
      this._layers[i].destroy();
      this._hotspotContainer.destroy();
    }
    this._geometry = null;
    this._view = null;
    this._sources = null;
    this._textureStores = null;
    this._layers = null;
    this._hotspotContainer = null;
  }

  //------------------------------------------------------------------------------------
  // METHODS
  //------------------------------------------------------------------------------------

  public createLayer(stage: any, eye: 'left' | 'right', rect: any) {
    //const path = FS.path(this.player.stagePath);
    const path = 'assets/tiles'; // @TODO TEMPORARY TEST PATH
    const index = this._layers.length;
    this._sources.push(new Marzipano.ImageUrlSource.fromString(
      `${path}/${this.id}/${eye}/{z}/{f}/{y}/{x}.jpg`,
      { cubeMapPreviewUrl: `${path}/${this.id}/${eye}/preview.jpg` }
    ));
    this._textureStores.push(new Marzipano.TextureStore(this._geometry, this._sources[index], stage));
    this._layers.push(new Marzipano.Layer(stage, this._sources[index], this._geometry, this._view, this._textureStores[index],
      { effects: { rect: rect } }
    ));
    this._layers[index].pinFirstLevel();
  }

  public setEye(eye: 'left' | 'right') {
    if (eye === 'left') {
      this._hotspotContainer.setRect(this._layers[0].effects().rect);
    } else {
      this._hotspotContainer.setRect(this._layers[1].effects().rect);
    }
    this._hotspotContainer._update();
  }

  //------------------------------------------------------------------------------------
  // GETTERS & SETTERS
  //------------------------------------------------------------------------------------

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get levels(): Level[] {
    return this._levels;
  }

  public set levels(value: Level[]) {
    this._levels = value;
  }

  public get initialViewParameters(): Vector3 {
    return this._initialViewParameters;
  }

  public set initialViewParameters(value: Vector3) {
    this._initialViewParameters = value;
  }

  public get faceSize(): number {
    return this._faceSize;
  }

  public set faceSize(value: number) {
    this._faceSize = value;
  }

  public get linkHotspots(): LinkHotspot[] {
    return this._linkHotspots;
  }

  public set linkHotspots(value: LinkHotspot[]) {
    this._linkHotspots = value;
  }

  public get infoHotspots(): InfoHotspot[] {
    return this._infoHotspots;
  }

  public set infoHotspots(value: InfoHotspot[]) {
    this._infoHotspots = value;
  }


  public get view(): any {
    return this._view;
  }

  public set view(value: any) {
    this._view = value;
  }


  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  static fromJSON(player: CorePlayer, json: ISceneData | string): Scene {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Scene.fromJSON(player, value) : value;
      });
    } else {
      return Object.assign(new Scene(player), json, {
        levels: json.levels.map(level => Level.fromJSON(level)),
        initialViewParameters: new Vector3(json.initialViewParameters.yaw, json.initialViewParameters.pitch),
        linkHotspots: json.linkHotspots.map(hotspot => LinkHotspot.fromJSON(player, hotspot)),
        infoHotspots: json.infoHotspots.map(hotspot => InfoHotspot.fromJSON(player, hotspot)),
      });
    }
  }
}