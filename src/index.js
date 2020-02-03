export {
  FLIP_FIRST
, FLIP_LAST_INVERSE_PLAY
} from "./commands/FLIP.js"

export {
  INJECT_HEAD
} from "./commands/head.js"

export {
  HURL
, HURLer
} from "./commands/routing.js"

export {
  SET_STATE
} from "./commands/state.js"

export {
  boot
, registerCMD
, registerRouter
, registerRouterDOM
} from "./core/registers.js"

export {
  DOMnavigated$
, run$
} from "./core/spule.js"

export {
  $store$
, set$$tate
} from "./store/state.js"

export {
  FLIPkid
} from "./components/FLIPkid.js"

export {
  BODY_
, DEFAULT_CFG
, DOM_
, HEAD_
, PAGE_TEMPLATE_
, ROOT_
, ROUTE_LOADING_
, ROUTE_PATH_
, URL_
, URL_data_
, URL_domain_
, URL_hash_
, URL_page_
, URL_path_
, URL_query_
, URL_subdomain_
, app_
, args_
, draft_
, erro_
, handler_
, post_
, prefix_
, prep_
, reso_
, root_
, router_
, run_
, source$_
, state_
, sub$_
, trace_
} from "./store/constants.js"

export {
  trace$
} from "./utils/trace$.js"
export {
  fURL,
  unfURL
} from "./utils/URL.js"
