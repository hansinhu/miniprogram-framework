// tyml 模版数据

function getPageXML_100(data) {
  return {
    tag: "ty-page",
    props: {},
    children: [
      {
        tag: "ty-view",
        props: {
          class: "title " + data.prop,
          "bind:tap": "handleTap",
          prop: data.prop,
          staticProp: "静态属性",
        },
        children: [
          {
            tag: "ty-text",
            props: {},
            children: ["从0到1打造小程序框架"],
          },
        ],
      },
      {
        tag: "ty-view",
        props: { class: "foo", "bind:tap": "handleTap" },
        children: [
          {
            tag: "ty-text",
            props: {},
            children: [
              "双进程模型、数据通信、组件体系、事件体系、Virtual Node、框架基础方法",
            ],
          },
        ],
      },
    ],
  };
}

__pagePath__ = "pages/home/index";
__pageCurrentFile__ = `${__pagePath__}.tyml`;
define(__pageCurrentFile__, function (require, module, exports) {
  module.exports = getPageXML_100;
});

__appCode__[__pageCurrentFile__] = require(__pageCurrentFile__);
