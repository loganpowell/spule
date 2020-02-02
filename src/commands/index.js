export {
  HURL,
  __HREF_PUSHSTATE_DOM,
  __NOTIFY_PRERENDER_DOM,
  __SET_LINK_ATTRS_DOM
} from "./routing.js"
export { INJECT_HEAD } from "./head.js"
export { F_LIP_, _F_LIP } from "./FLIP.js"
export { SET_STATE } from "./state.js"

export const msTaskDelay = t => new Promise(resolve => setTimeout(resolve, t))
