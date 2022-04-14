import { isObject, isString, isArray, isNotEmptyObj, objForEach, aryForEach } from "../util/index.js";

import { NOKEY } from "../util/common.js";

const eventMap = { tap: "click" };

class Element {
  constructor(tagName, props, children) {
    // 标签
    this.tagName = tagName;
    // 属性
    this.props = isObject(props) ? props : {};
    this.children = children || (!isNotEmptyObj(this.props) && ((isString(props) && [props]) || (isArray(props) && props))) || [];

    this.key = props ? props.key : void NOKEY;

    // 计算节点数
    let count = 0;
    aryForEach(this.children, (item, index) => {
      if (item instanceof Element) {
        count += item.count;
      } else {
        this.children[index] = "" + item;
      }
      count++;
    });
    this.count = count;
  }

  render() {
    const dom = document.createElement(this.tagName);
    const props = this.props;
    // 注入属性
    objForEach(props, (propName) => {
      if (propName.startsWith("bind:")) {
        dom.addEventListener(eventMap[propName.substring(5)], function (event) {
          window.applyHandle(props[propName], { type: event.type });
        });
      } else {
        dom.setAttribute(
          propName.replace(/([A-Z])/, (_, U) => {
            return "-" + U;
          }),
          props[propName]
        );
      }
    });
    // 渲染children
    aryForEach(this.children, (child) => {
      const childDom =
        child instanceof Element
          ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
          : document.createTextNode(child); // 如果字符串，只构建文本节点
      dom.appendChild(childDom);
    });
    return dom;
  }
}

// 改变传参方式,免去手动实例化
export default function createElement(tagName, props, children) {
  return new Element(tagName, props, children);
}
