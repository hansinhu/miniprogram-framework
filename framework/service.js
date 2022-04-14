// 框架逻辑
function getLaunchOptionsSync() {
  const params = new URLSearchParams(location.search);
  const query = Object.fromEntries(params.entries());
  return query;
}

class AppInst {
  constructor(config) {
    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });
  }
}

// 当前逻辑代码路径
let __appCode__ = {};
let __corePath__;
// 当前逻辑所在文件
let __coreCurrentFile__;

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

// 逻辑层代码解析完成
// 开始根据启动参数实例化页面
// 等待渲染层 ready 渲染页面
// 强制发送指令到容器，由容器管理指令队列， 通知容器，逻辑准备完毕
function __pageReady__() {
  sendAction({ action: "process_finished" }, true);
}

// 渲染进程是否已经 ready 可以向其发送消息
let rendererPageReadyFlag = {};

/**
 * 向渲染层发送指令
 * @param {object} actionData - 指令数据
 * @param {boolean} force - 强制发送
 */
function sendAction(actionData, force) {
  if (force || rendererPageReadyFlag[actionData.path]) {
    window.parent.top.postMessage({ from: "service", ...actionData });
  }
}

// 接受来自渲染进程的消息
window.addEventListener("message", function (event) {
  const message = event.data;
  switch (message.action) {
    // 页面初始化， 初始化参数来自页面地址 及 query
    case "page_init": {
      const options = { path: message.path, query: message.query };
      const page = exparser.createPage(options);
      rendererPageReadyFlag[options.path] = true;

      // 回传页面首次渲染
      sendAction({
        action: "page_render",
        path: message.path,
        data: exparser.getPage(options.path).data,
      });
      // 触发 onLoad 事件 onShow 事件
      page.__callLifecycle__("onLoad", options);
      page.__callLifecycle__("onShow");

      break;
    }
    case "page_method": {
      const pageInst = exparser.getPage(message.path);
      try {
        pageInst[message.handle].apply(pageInst, message.args);
      } catch (err) {
        console.error(`${message.path}:${message.handle} 方法错误`);
        console.log(err);
      }
      break;
    }
  }
});

// app 的 show hide
window.addEventListener(
  "visibilitychange",
  function () {
    const hide = document.hidden;
    const app = getApp();
    if (app) {
      if (typeof app.onShow === "function") {
        !hide && app.onShow();
      }
      if (typeof app.onHide === "function") {
        hide && app.onHide();
      }
    }
  },
  false
);

// 逻辑层代码执行完成
// 容器层增加相关 event 监听
window.addEventListener("load", function () {
  __pageReady__();
});
