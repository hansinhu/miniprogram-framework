import createElement from "./element.js";
import patch from "./patch.js";

const create = (vnode) => {
  if (typeof vnode === "string") {
    return vnode;
  }
  return createElement(
    vnode.tag,
    vnode.props,
    (vnode.children || []).map((node) => {
      return create(node);
    })
  );
};

const VirtualDOM = {
  patch,
  createElement,
  create(vnode) {
    return create(vnode);
  },
};

globalThis.VirtualDOM = VirtualDOM;
