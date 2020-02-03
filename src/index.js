/** @format */
import {
  FLIP_FIRST,
  FLIP_LAST_INVERSE_PLAY,
  INJECT_HEAD,
  HURL,
  HURLer,
  SET_STATE
} from "./commands"

import {
  boot,
  registerCMD,
  registerRouter,
  registerRouterDOM,
  DOMnavigated$,
  run$
} from "./core"

import { $store$, set$$tate } from "./store"

import { FLIPkid } from "./components"

import {
  BODY_,
  DEFAULT_CFG,
  DOM_,
  HEAD_,
  PAGE_TEMPLATE_,
  ROOT_,
  ROUTE_LOADING_,
  ROUTE_PATH_,
  URL_,
  URL_data_,
  URL_domain_,
  URL_hash_,
  URL_page_,
  URL_path_,
  URL_query_,
  URL_subdomain_,
  app_,
  args_,
  draft_,
  erro_,
  handler_,
  post_,
  prefix_,
  prep_,
  reso_,
  root_,
  router_,
  run_,
  source$_,
  state_,
  sub$_,
  trace_
} from "./constants.js"

import { trace$, fURL, unfURL } from "./utils"

export const spule = {
  FLIP_FIRST,
  FLIP_LAST_INVERSE_PLAY,
  INJECT_HEAD,
  HURL,
  HURLer,
  SET_STATE,
  boot,
  registerCMD,
  registerRouter,
  registerRouterDOM,
  DOMnavigated$,
  run$,
  $store$,
  set$$tate,
  FLIPkid,
  trace$,
  fURL,
  unfURL,
  constants: {
    BODY_,
    DEFAULT_CFG,
    DOM_,
    HEAD_,
    PAGE_TEMPLATE_,
    ROOT_,
    ROUTE_LOADING_,
    ROUTE_PATH_,
    URL_,
    URL_data_,
    URL_domain_,
    URL_hash_,
    URL_page_,
    URL_path_,
    URL_query_,
    URL_subdomain_,
    app_,
    args_,
    draft_,
    erro_,
    handler_,
    post_,
    prefix_,
    prep_,
    reso_,
    root_,
    router_,
    run_,
    source$_,
    state_,
    sub$_,
    trace_
  }
}
