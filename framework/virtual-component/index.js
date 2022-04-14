import createComponent from "./component.js";
import patch from "./patch.js";

const create = (vnode) => {
  if (typeof vnode === "string") {
    return vnode;
  }
  return createComponent(
    vnode.tag,
    vnode.props,
    (vnode.children || []).map((node) => {
      return create(node);
    })
  );
};

const VirtualComponent = {
  patch,
  create(vnode) {
    return create(vnode);
  },
};

globalThis.VirtualComponent = VirtualComponent;
