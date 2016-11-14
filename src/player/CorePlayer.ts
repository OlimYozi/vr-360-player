const Marzipano = require('marzipano');

import SceneManager from './Managers/SceneManager';
import WebVRView from './WebVRView';

export interface ILifeCycle {
  onCreate(): boolean;
  onResume();
  onResize();
  onPause();
  onDestroy();
}

/**
 * Virtual reality 360 player library
 */
export default class CorePlayer implements ILifeCycle {

  public sceneManager: SceneManager;

  public view: ILifeCycle;

  constructor(public node: HTMLElement, public stagePath: string) {
    this.stagePath = stagePath;
    this.sceneManager = new SceneManager();
    this.view = new WebVRView(this);

    this.sceneManager.loadFromFile(this.stagePath, () => {
      this.onCreate();
    });
  }

  onCreate(): boolean {
    this.view.onCreate();
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
}