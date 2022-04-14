import exparser from "../exparser/index.js";
import clone from "../util/clone.js";

class Component {
  constructor(tagName, props, children) {
    // 获取到注册的函数，将逻辑绑定过来

    this.tagName = tagName;
    this.childComponents = children;

    this.eventProps = {};

    this.data = this.config.data || {};
    this.initialProps = this.execProperties;

    // 注意弱拷贝
    this.props = clone(this.initialProps);

    this.updateProps(props);
  }

  get config() {
    return exparser.getComponentConfig(this.tagName) || {};
  }

  get properties() {
    return this.config.properties || {};
  }

  /** 获取 properties 初始化的 props 数据 */
  get execProperties() {
    const propsData = {};
    Object.keys(this.properties)
      .filter((propName) => !propName.startsWith("bind"))
      .forEach((propName) => {
        const propConfig = this.properties[propName];
        switch (propConfig.type) {
          case String:
            propsData[propName] = propConfig.value || "";
            break;
          case Boolean:
            propsData[propName] = propConfig.value || false;
            break;
          default:
            console.log("尚未支持的 property 类型", propName);
        }
      });

    return propsData;
  }

  /** 更新 props */
  updateProps = (props) => {
    if (!props) {
      return;
    }
    const eventProps = {};
    const normalProps = {};

    Object.keys(props).forEach((propName) => {
      const newValue = props[propName];
      const oldValue = this.props[propName];

      if (propName.startsWith("bind")) {
        eventProps[propName] = newValue;
      } else {
        normalProps[propName] = newValue;
        this.triggerPropertyObserver(propName, newValue, oldValue);

        this.props[propName] = newValue;
        this.data[propName] = newValue;
      }
    });

    this.eventProps = Object.assign(this.eventProps, eventProps);
  };

  /** 触发 Observer */
  triggerPropertyObserver(propName, newValue, oldValue) {
    const properties = this.properties;
    const propertyConfig = properties[propName];
    if (propertyConfig && typeof propertyConfig.observer === "function" && newValue !== oldValue) {
      propertyConfig.observer(newValue, oldValue);
    }
  }
}

/**
 * 创建逻辑层实例对象
 */
export default function createComponent(tagName, props, children) {
  return new Component(tagName, props, children);
}
