const Marzipano = require('marzipano');

export interface ILifeCycle {
  onCreate();
  onResume();
  onResize();
  onPause();
  onDestroy();
}

/**
 * Virtual reality 360 player library
 */
export default class VR360Player implements ILifeCycle {

  constructor(public node: HTMLElement) {

    // Create viewer.
    var viewer = new Marzipano.Viewer(node);

    // Create source.
    var source = Marzipano.ImageUrlSource.fromString(
      "//www.marzipano.net/media/cubemap/{f}.jpg"
    );

    // Create geometry.
    var geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

    // Create view.
    var limiter = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180);
    var view = new Marzipano.RectilinearView(null, limiter);

    // Create scene.
    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Display scene.
    scene.switchTo();
  }

  onCreate() {

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