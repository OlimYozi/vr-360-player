import Easing from '../Math/Easing';
import Scene from '../Entities/Scene';

export default class Transition {

  static Opacity(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      val = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({ opacity: val });
      })
    }
  };

  static FromRight(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      val = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({ rect: { relativeX: 1 - val } });
      })
    }
  };

  static FromTop(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      val = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({ rect: { relativeY: -1 + val } });
      })
    }
  };

  static FromBottom(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      val = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({ rect: { relativeY: 1 - val } });
      })
    }
  };

  static Width(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      val = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({ rect: { relativeWidth: val } });
      })
    }
  };

  static FromCenter(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      val = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({
          rect: {
            relativeWidth: val,
            relativeHeight: val,
            relativeX: 0.5 - val / 2,
            relativeY: 0.5 - val / 2
          }
        });
      });
    };
  };

  static FromCenterAndOpacity(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      const eased = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({
          rect: {
            relativeWidth: eased,
            relativeHeight: eased,
            relativeX: 0.5 - eased / 2,
            relativeY: 0.5 - eased / 2
          },
          opacity: val,
        });
      });
    }
  };

  static FromTopAndOpacity(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      const eased = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({ opacity: val, rect: { relativeY: -1 + eased } });
      })
    }
  };

  static FromWhite(ease = Easing.Linear) {
    return (val, scene: Scene) => {
      const eased = ease(val);
      scene.layers.forEach((layer: any) => {
        layer.setEffects({ colorOffset: [1 - val, 1 - val, 1 - val, 0] });
      })
    }
  };

  static ThroughBlack(ease = Easing.Linear) {
    return (val, scene: Scene, oldScene: Scene) => {
      const eased = ease(val);
      let offset;

      if (eased < 0.5) {
        offset = eased * 2;
        scene.layers.forEach((layer: any) => {
          layer.setEffects({ opacity: 0 });
        })
        oldScene.layers.forEach((layer: any) => {
          layer.setEffects({ colorOffset: [-offset, -offset, -offset, 0] })
        })
      }
      else {
        offset = 1 - ((eased - 0.5) * 2);
        scene.layers.forEach((layer: any) => {
          layer.setEffects({ opacity: 1, colorOffset: [-offset, -offset, -offset, 0] })
        })
      }
    }
  }
};