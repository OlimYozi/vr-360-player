import Easing from '../Math/Easing';
import Scene from '../Entities/Scene';

export default class Transition {

  static FadeIn(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { opacity: val }));
      })
    }
  };

  static FadeOut(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { opacity: 1 - val }));
      })
    }
  };

  static FromRight(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { rect: { relativeX: 1 - val } }));
      })
    }
  };

  static FromTop(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { rect: { relativeY: -1 + val } }));
      })
    }
  };

  static FromBottom(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { rect: { relativeY: 1 - val } }));
      })
    }
  };

  static Width(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { rect: { relativeWidth: val } }));
      })
    }
  };

  static ZoomCenter(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, {
          rect: {
            relativeWidth: 1 + val,
            relativeHeight: 1 + val,
            relativeX: 0.5 - (1 + val) / 2,
            relativeY: 0.5 - (1 + val) / 2
          }
        }));
      });
    };
  };

  static FromCenter(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      val = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, {
          rect: {
            relativeWidth: val,
            relativeHeight: val,
            relativeX: 0.5 - val / 2,
            relativeY: 0.5 - val / 2
          }
        }));
      });
    };
  };

  static FromCenterAndOpacity(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      const eased = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, {
          rect: {
            relativeWidth: eased,
            relativeHeight: eased,
            relativeX: 0.5 - eased / 2,
            relativeY: 0.5 - eased / 2
          },
          opacity: val,
        }));
      });
    }
  };

  static FromTopAndOpacity(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      const eased = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { opacity: val, rect: { relativeY: -1 + eased } }));
      });
    }
  };

  static FromWhite(ease = Easing.Linear): (val: number, scene: Scene) => void {
    return (val: number, scene: Scene) => {
      const eased = ease(val);
      scene.layers.pair((layer: any) => {
        let effects = layer.effects();
        layer.setEffects(Object.assign(effects, { colorOffset: [1 - val, 1 - val, 1 - val, 0] }));
      });
    }
  };

  static ThroughBlack(ease = Easing.Linear): (val: number, scene: Scene, oldScene: Scene) => void {
    return (val: number, scene: Scene, oldScene: Scene) => {
      const eased = ease(val);
      let offset;

      if (eased < 0.5) {
        offset = eased * 2;
        scene.layers.pair((layer: any) => {
          let effects = layer.effects();
          layer.setEffects(Object.assign(effects, { opacity: 0 }));
        });
        oldScene.layers.pair((layer: any) => {
          let effects = layer.effects();
          layer.setEffects(Object.assign(effects, { colorOffset: [-offset, -offset, -offset, 0] }));
        });
      }
      else {
        offset = 1 - ((eased - 0.5) * 2);
        scene.layers.pair((layer: any) => {
          let effects = layer.effects();
          layer.setEffects(Object.assign(effects, { opacity: 1, colorOffset: [-offset, -offset, -offset, 0] }));
        });
      }
    }
  }
};