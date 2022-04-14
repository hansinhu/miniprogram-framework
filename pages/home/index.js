/**
 * 渲染层启动
 */

__pageCurrentFile__ = __pagePath__ + ".css";
define(__pageCurrentFile__, function (require, module, exports) {
  module.exports = function () {
    // TODO: setCssToHead  实现该方法
    const style = document.createElement("style");
    const css = document.createTextNode(`
    ty-page{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .title {padding: 20px; font-size: 28px}
    .foo{color: #3029E6; padding: 0 40px;}
    .color0{color:#E8CA8B; }
    .color1{color:#DD9EBB; }
    .color2{color:#C4E8F6; }
    .color3{color:#A5C56D; }
    .color4{color:#33531D; }`);
    style.appendChild(css);
    document.head.appendChild(style);
  };
});

__appCode__[__pageCurrentFile__] = require(__pageCurrentFile__);
