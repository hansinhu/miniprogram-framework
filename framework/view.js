let __appCode__ = {};
let __pagePath__;
let __pageCurrentFile__;

function getQuery() {
  const params = new URLSearchParams(location.search);
  const query = Object.fromEntries(params.entries());
  return query;
}

const eventMap = { tap: "click" };

let pageVNodeTree;
let pageRoot;

function __pageRender__(message) {
  const { path, data } = message;
  const xmlFn = require(path + ".xml");
  // 页面 vnode 树
  const nodeTree = xmlFn(data);

  const cssFn = require(path + ".css");

  // 添加页面样式
  cssFn();

  const VDom = VirtualDOM.create(nodeTree);

  pageRoot = VDom.render();

  document.body.appendChild(pageRoot);
  applyHandle("onReady");

  pageVNodeTree = nodeTree;
}

function __pageUpdate__(message) {
  const { path, data } = message;
  const xmlFn = require(path + ".xml");
  const newVNodeTree = xmlFn(data);

  // 计算 vnode 树的节点变更
  const patches = VirtualNode.diff(pageVNodeTree, newVNodeTree);

  VirtualDOM.patch(pageRoot, patches);
}

// 由页面 index.js 触发
function __pageReady__() {
  sendAction({ action: "process_finished", path: __pagePath__ });
  // 页面初始化
  sendAction({ action: "page_init", path: __pagePath__, query: getQuery() });
}

// 发送指令到逻辑层
function sendAction(data) {
  window.parent.top.postMessage({ from: "renderer", ...data });
}

// 触发逻辑层事件
window.applyHandle = function applyHandle(name, ...args) {
  window.parent.top.postMessage({
    from: "renderer",
    action: "page_method",
    path: __pagePath__,
    handle: name,
    args,
  });
};

// 接受来自逻辑层的指令
window.addEventListener("message", function (event) {
  const message = event.data;
  switch (message.action) {
    case "page_render": {
      // console.warn('page_render', message);
      __pageRender__(message);
      break;
    }
    case "page_update": {
      // console.warn('page_update', message);
      __pageUpdate__(message);
      break;
    }
  }
});

// 基础库组件样式
const style = document.createElement("style");
style.appendChild(document.createTextNode("ty-view {display: block}"));
document.head.appendChild(style);

// 渲染层代码执行完成
window.addEventListener("load", function () {
  __pageReady__();
});
