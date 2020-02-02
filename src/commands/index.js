import {
  HURL,
  __HREF_PUSHSTATE_DOM,
  __NOTIFY_PRERENDER_DOM,
  __SET_LINK_ATTRS_DOM
} from "./routing.js"
import { INJECT_HEAD } from "./head.js"
import { F_LIP_, _F_LIP } from "./FLIP.js"
import { SET_STATE } from "./state.js"

export default {
  HURL,
  __HREF_PUSHSTATE_DOM,
  __NOTIFY_PRERENDER_DOM,
  __SET_LINK_ATTRS_DOM,
  INJECT_HEAD,
  F_LIP_,
  _F_LIP,
  SET_STATE,
  msTaskDelay: t => new Promise(resolve => setTimeout(resolve, t))
}
