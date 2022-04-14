__corePath__ = "app";
__coreCurrentFile__ = __corePath__ + ".js";

define(__coreCurrentFile__, function (require, module, exports) {
  App({
    globalData: {
      foo: "bar",
    },
    onLaunch(options) {
      console.warn("app.onLaunch", options);
      console.log(this);
    },
    onShow() {
      console.warn("app.onShow", Date.now());
    },
    onHide() {
      console.warn("app.onHide", Date.now());
    },
    onError(error) {
      console.warn("app.onError", error);
    },
  });
});

try {
  require(__coreCurrentFile__);
} catch (err) {
  console.log(__coreCurrentFile__ + " 错误", err);
  throw err;
}

__corePath__ = "ty-view";
__coreCurrentFile__ = __corePath__ + ".js";

define(__coreCurrentFile__, function (require, module, exports) {
  Component({
    properties: {
      class: {
        type: String,
        observer(newValue, oldValue) {
          console.log(`ty-view property observer new: "${newValue}", old: "${oldValue}"`);
        },
      },
    },
    data: {
      inner: "内部数据",
    },
  });
});

try {
  require(__coreCurrentFile__);
} catch (err) {
  console.log(__coreCurrentFile__ + " 错误", err);
  throw err;
}

// 由构建器合并代码时按顺序拼接
__corePath__ = "pages/home/index";
__coreCurrentFile__ = __corePath__ + ".js";

define(__coreCurrentFile__, function (require, module, exports, window) {
  Page({
    data: {
      name: "页面数据",
      prop: "color0",
      index: 0,
    },
    onLoad(options) {
      console.warn("home.onLoad", options);
      this.setData({ hello: "world", name: "点我更新" });
      console.log("getCurrentPages", getCurrentPages());
    },
    onShow() {
      console.warn("home.onShow");
    },
    onReady() {
      console.warn("home.onReady");
    },
    onHide() {
      console.warn("home.onHide");
    },
    onUnload() {
      console.warn("home.onUnload");
    },
    handleTap(event) {
      console.warn("abc", event);
      const index = this.data.index;
      this.setData({
        index: index + 1,
        name: Date.now() + "",
        prop: "color" + ((index + 1) % 5),
      });
    },
  });
});

try {
  require(__coreCurrentFile__);
} catch (err) {
  console.log(__coreCurrentFile__ + " 错误", err);
  throw err;
}
