/**
 * index.tyss
 */

function getPageCSS_100() {
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
}

__pageCurrentFile__ = __pagePath__ + ".tyss";
define(__pageCurrentFile__, function (require, module, exports) {
  module.exports = getPageCSS_100;
});

try {
  require(__pageCurrentFile__);
} catch (err) {
  console.log(__pageCurrentFile__ + " 错误", err);
  throw err;
}
