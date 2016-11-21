//------------------------------------------------------------------------------------
// CSS UTILITIES
//------------------------------------------------------------------------------------

export default class CSS {

  static Prefixed = ['animation', 'filter', 'transform', 'transition'];

  static SetRules(element: HTMLElement, rules: any) {
    for (let property in rules) {
      if (!rules.hasOwnProperty(property))
        continue;

      if (CSS.Prefixed.indexOf(property) !== -1) {
        for (let prefix of CSS.Prefix(property)) {
          element.style['test'] = 1;
          element.style[prefix] = rules[property];
        }

      } else {
        element.style[property] = rules[property];
      }
    }
  };

  static AppendRules(element: HTMLElement, rules: any) {
    for (let property in rules) {
      if (!rules.hasOwnProperty(property))
        continue;

      if (CSS.Prefixed.indexOf(property) !== -1) {
        for (let prefixedProperty of CSS.Prefix(property)) {
          element.style[prefixedProperty] += ' ' + rules[property];
        }

      } else {
        element.style[property] += ' ' + rules[property];
      }
    }
  };

  ToStyle(rules: any): any {
    let style = {};

    for (let property in rules) {
      if (!rules.hasOwnProperty(property))
        continue;

      if (CSS.Prefixed.indexOf(property) !== -1) {
        for (let prefixedProperty of CSS.Prefix(property)) {
          style[prefixedProperty] = rules[property];
        }

      } else {
        style[property] = rules[property];
      }
    }

    return style;
  };

  static Prefix(property: any): any[] {
    property = property.charAt(0).toUpperCase() + property.slice(1);
    return [
      'Webkit' + property,
      'Moz' + property,
      'ms' + property,
      'O' + property,
      property.toLowerCase()
    ];
  };
}