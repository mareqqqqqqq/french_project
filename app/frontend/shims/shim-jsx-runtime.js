const R = window.React;
export function jsx(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  return R.createElement(type, rest, children);
}
export function jsxs(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  return R.createElement(type, rest, ...(Array.isArray(children) ? children : [children]));
}
export const jsxDEV = jsx;
export const Fragment = R.Fragment;
