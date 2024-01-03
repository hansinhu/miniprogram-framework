class AppInst {
  constructor(config) {
    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });
  }
}

class PageInst {
  constructor({ path, config, options, vnodeFactory }) {
    // clone 复用页面
    const cloneConfig = clone(config);

    this.route = path;
    this.__route__ = path;

    this.__vnodeFactory = vnodeFactory;

    Object.keys(cloneConfig).forEach((key) => {
      this[key] = cloneConfig[key];
    });

    this.VNode = this.__vnodeFactory(this.data);

    this.VComponent = VirtualComponent.create(this.VNode);
  }

  setData(newData) {
    this.data = Object.assign({}, this.data, newData);

    const newVNode = this.__vnodeFactory(this.data);

    const patches = VirtualNode.diff(this.VNode, newVNode);

    // 逻辑层数据变更，计算最小变更路径

    this.VNode = newVNode;

    VirtualComponent.patch(this.VComponent, patches);

    sendAction({ action: "page_update", path: this.route, data: this.data });
  }

  __callLifecycle__(name, ...args) {
    if (typeof this[name] == "function") {
      this[name].apply(this, args);
    }
  }
}

const appEngine = (function () {
  let appInstance;
  const __pageConfigMap__ = {};
  const __componentConfigMap__ = {};
  const __pagesInstQueue__ = []; // 页面实例堆栈
  const __pagesInstMap__ = {}; // 页面实例 map

  return {
    createApp(config) {
      appInstance = new AppInst(config);

      if (typeof appInstance.onLaunch === "function") {
        appInstance.onLaunch(getLaunchOptionsSync());
      }
    },
    getApp() {
      return appInstance;
    },
    App(config) {
      this.createApp(config);
    },

    Page(config) {
      // 准备好默认配置，可在此附加一定的默认值
      __pageConfigMap__[__corePath__] = config;
    },

    Component(config) {
      // 准备好默认配置，可在此附加一定的默认值
      __componentConfigMap__[__corePath__] = config;
    },

    getCurrentPages() {
      return __pagesInstQueue__;
    },

    getComponentConfig(tagName) {
      return __componentConfigMap__[tagName] || {};
    },

    createPage(options) {
      const { path, query } = options;
      const config = __pageConfigMap__[path];

      const tymlFn = require(path + ".tyml");

      if (!config) {
        throw new Error("页面配置不存在" + path);
      } else {
        const pageInst = new PageInst({
          path,
          config,
          options,
          vnodeFactory: tymlFn,
        });

        __pagesInstQueue__.push(pageInst);
        __pagesInstMap__[path] = pageInst;

        return pageInst;
      }
    },

    getPage(path) {
      return __pagesInstMap__[path];
    },
  };
})();

globalThis.appEngine = appEngine;
globalThis.App = appEngine.App.bind(appEngine);
globalThis.Page = appEngine.Page.bind(appEngine);
globalThis.Component = appEngine.Component.bind(appEngine);
globalThis.getApp = appEngine.getApp.bind(appEngine);
globalThis.getCurrentPages = appEngine.getCurrentPages.bind(appEngine);

export default appEngine;
