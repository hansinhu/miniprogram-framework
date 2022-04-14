import { isString, isObject, objForEach, aryForEach, setAttr, toArray } from "../util/index.js";
import { REPLACE, REORDER, PROPS, TEXT, NOKEY } from "../util/common.js";

function patch(node, patches) {
  const walker = { index: 0 };
  // 深度优先
  dfsWalk(node, walker, patches);
}

// 深度遍历更新
function dfsWalk(node, walker, patches) {
  const currentPatches = patches[walker.index];

  node.childComponents &&
    aryForEach(node.childComponents, (item) => {
      walker.index++;
      dfsWalk(item, walker, patches);
    });

  currentPatches && applyPatches(node, currentPatches);
}

// 更新类型
function applyPatches(node, currentPatches) {
  aryForEach(currentPatches, (item) => {
    switch (item.type) {
      case REPLACE:
        // const nNode = isString(item.node) ? document.createTextNode(item.node) : item.node.render();
        // node.parentNode.replaceChild(nNode, node);
        break;
      case REORDER:
        // reorderChildren(node, item.moves);
        break;
      case PROPS:
        node.updateProps(item.props);
        break;
      case TEXT:
        // if (node.textContent) {
        //   // 使用纯文本
        //   node.textContent = item.content;
        // } else {
        //   // 仅仅对CDATA片段，注释comment，Processing Instruction节点或text节点有效
        //   node.nodeValue = item.content;
        // }
        break;
      default:
        throw new Error("Unknown patch type " + item.type);
    }
  });
}

export default patch;
