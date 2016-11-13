export default class DOM {

  constructor() {

  }

  static createNode(html: string, parent?: Node): Node {
    let temp = document.createElement('div');
    temp.innerHTML = html;
    let dom = <HTMLElement>temp.firstChild;
    if (parent)
      parent.appendChild(dom);
    temp = null;
    return dom;
  }
}