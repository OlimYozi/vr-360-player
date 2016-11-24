const Marzipano = require('marzipano');

import Player, { ILifeCycle } from '../Player';
import CSS from '../Utils/CSS';
import PanoramaMode from '../PanoramaMode';
import StereoscopicMode from '../StereoscopicMode';
import Vector3 from '../Math/Vector3';
import Level from './Level';
import LinkHotspot, { ILinkHotspotData } from './Hotspot/LinkHotspot';
import InfoHotspot, { IInfoHotspotData } from './Hotspot/InfoHotspot';

/** Interface describing the required data to create a new [[Scene]]. */
export interface ISceneData {
  id: string;
  name: string;
  levels: Level[];
  faceSize: number;
  initialViewParameters: Vector3;
  linkHotspots: ILinkHotspotData[];
  infoHotspots: IInfoHotspotData[];
}

/** Class used to create a cubic image layer in the viewer. */
export default class Scene implements ILifeCycle {

  static PANORAMA_LIMITER = Marzipano.util.compose(
    Marzipano.RectilinearView.limit.vfov(110 * Math.PI / 180, 110 * Math.PI / 180),
    Marzipano.RectilinearView.limit.hfov(110 * Math.PI / 180, 110 * Math.PI / 180),
    Marzipano.RectilinearView.limit.pitch(-Math.PI / 2, Math.PI / 2));

  static STEREOSCOPIC_LIMITER = Marzipano.util.compose(
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

  private _player: Player;
  private _geometry: any;
  private _view: any;
  private _hotspotContainer: any;
  private _sources: any[];
  private _textureStores: any[];
  private _layers: any[];

  private _cancelTweening: () => void;

  /** Contructor initializing stores, however does not create anything until the [[onCreate]] method is called.
   * @param _player The base player context.
   */
  constructor(
    _player: Player,
  ) {
    this._player = _player || this._player;
    this._sources = [];
    this._textureStores = [];
    this._layers = [];
  }

  /** Called after the constructor to create variables that later need to be disposed.
   * Using data specified in [[ISceneData]] to create the scene's layers for both eyes and hotspots.
   */
  onCreate(): boolean {
    this._geometry = new Marzipano.CubeGeometry(this._levels);
    this._view = new Marzipano.RectilinearView(this._initialViewParameters, Scene.PANORAMA_LIMITER);

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

  /** Called by [[SceneManager.switchScene]] to change the currently displayed scene to this with and optional transition. */
  onAttach(transition?: (val: number, scene: Scene) => void, duration?: number, done?: () => void) {
    const stage = this._player.viewer.stage();
    stage.addLayer(this._layers[0]);

    // Change layer size depending on mode
    if (this._player.mode instanceof PanoramaMode) {
      this._view.setLimiter(Scene.PANORAMA_LIMITER);
      this._layers[0].setEffects({ rect: { relativeWidth: 1 } });
      this.setEye('left');
    } else {
      this._view.setLimiter(Scene.STEREOSCOPIC_LIMITER);
      this._layers[0].setEffects({ rect: { relativeWidth: 0.5 } });
      stage.addLayer(this._layers[1]);
      this.setEye((<StereoscopicMode>this._player.mode).dominantEye);
    }

    // If no transition specified just return callback
    if (!transition) {
      this._hotspotContainer.show();
      if (typeof done === 'function') done();
      return;
    }

    // Cancel any ongoing transition
    if (this._cancelTweening) {
      this._cancelTweening();
      this._cancelTweening = null;
    }

    // Start a new tweening
    this._cancelTweening = Marzipano.util.tween(duration, (val) => {
      transition(val, this);
    }, () => {
      this._cancelTweening = null;
      this._hotspotContainer.show();
      if (typeof done === 'function') done();
    });
  }

  /** Called when window is focused after blur. */
  onResume() {
  }

  /** Called when window viewport size changes. */
  onResize() {
  }

  /** Called by [[SceneManager.switchScene]] to remove this scene with and optional transition. */
  onDetatch(transition?: (val: number, scene: Scene) => void, duration?: number, done?: () => void) {
    const stage = this._player.viewer.stage();

    // If no transition specified just return callback
    if (!transition) {
      this._hotspotContainer.hide();
      stage.removeLayer(this._layers[0]);
      if (stage.hasLayer(this._layers[1]))
        stage.removeLayer(this._layers[1]);

      if (typeof done === 'function') done();
      return;
    }

    // Cancel any ongoing transition
    if (this._cancelTweening) {
      this._cancelTweening();
      this._cancelTweening = null;
    }

    // Start a new tweening
    this._cancelTweening = Marzipano.util.tween(duration, (val) => {
      transition(val, this);
    }, () => {
      this._cancelTweening = null;
      this._hotspotContainer.hide();
      stage.removeLayer(this._layers[0]);
      if (stage.hasLayer(this._layers[1]))
        stage.removeLayer(this._layers[1]);

      if (typeof done === 'function') done();
    });
  }

  /** Called when window is blurred after focus. */
  onPause() {
  }

  /** Should be called at the end of a class' life cycle and should dispose all assigned variables. */
  onDestroy() {
    this._view.destroy();
    for (var i = 0; i < this._layers.length; i++) {
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

  /** Internal helper method for creating scene layers for each eye. */
  private createLayer(stage: any, eye: 'left' | 'right', rect: any) {
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

  /** Switches dominant eye moving hotspots to defined side. */
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

  /** Retrieves this scene's id. */
  public get id(): string {
    return this._id;
  }

  /** Retrieves this scene's name. */
  public get name(): string {
    return this._name;
  }

  /** Retrieves this scene's link hotspots. */
  public get linkHotspots(): LinkHotspot[] {
    return this._linkHotspots;
  }

  /** Retrieves this scene's info hotspots. */
  public get infoHotspots(): InfoHotspot[] {
    return this._infoHotspots;
  }

  /** Retrieves this scene's view. See marzipano view documentaion. */
  public get view(): any {
    return this._view;
  }

  /** Retrieves this scene's layers. See marzipano layer documentaion. */
  public get layers(): any[] {
    return this._layers;
  }

  //------------------------------------------------------------------------------------
  // SERIALIZE
  //------------------------------------------------------------------------------------

  /** Deserializes JSON data to create a new [[Scene]].
   * @param player The base player context.
   * @param json The JSON data required to create a new [[Scene]].
   * @return A new Scene from the deserialized JSON data.
   */
  static fromJSON(player: Player, json: ISceneData | string): Scene {
    if (typeof json === 'string') {
      return JSON.parse(json, (key: string, value: any) => {
        return !key ? Scene.fromJSON(player, value) : value;
      });
    } else {
      const scene = Object.assign(Object.create(Scene.prototype), {
        _player: player,
        _id: json.id,
        _name: json.name,
        _levels: json.levels.map(level => Level.fromJSON(level)),
        _faceSize: json.faceSize,
        _initialViewParameters: new Vector3(json.initialViewParameters.yaw, json.initialViewParameters.pitch),
        _linkHotspots: json.linkHotspots.map(hotspot => LinkHotspot.fromJSON(player, hotspot)),
        _infoHotspots: json.infoHotspots.map(hotspot => InfoHotspot.fromJSON(player, hotspot)),
      });
      Scene.apply(scene);
      return scene;
    }
  }
}