export {
  HURL
, INJECT_HEAD
, FLIP_LAST_INVERSE_PLAY
, FLIP_FIRST
, SET_STATE
// , msTaskDelay
} from "./commands"

// export { __URL_DOM__ROUTE, __URL_ROUTE } from "./tasks"

export { 
  fURL
// , unfURL 
} from "./utils"

export {
  registerRouter
, registerRouterDOM
, registerCMD
, boot
} from "./register/primaries"

export {
  DOMContentLoaded$
, DOMnavigated$
, command$
, log$
, popstate$
, task$
, out$
, run$
} from "./streams"

export { 
  FLIPkid 
} from "./components"

export { 
  $store$
, set$$tate 
} from "./store"
