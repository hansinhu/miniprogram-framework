const exparser = (function () {
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

      const xmlFn = require(path + ".xml");

      if (!config) {
        throw new Error("页面配置不存在" + path);
      } else {
        const pageInst = new PageInst({ path, config, options, vnodeFactory: xmlFn });

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

globalThis.exparser = exparser;
globalThis.App = exparser.App.bind(exparser);
globalThis.Page = exparser.Page.bind(exparser);
globalThis.Component = exparser.Component.bind(exparser);
globalThis.getApp = exparser.getApp.bind(exparser);
globalThis.getCurrentPages = exparser.getCurrentPages.bind(exparser);

export default exparser;
