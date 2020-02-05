export const URL_FULL: string = "URL"
export const URL_PATH: string = "URL_path"
export const URL_DATA: string = "URL_data"
export const URL_DOMN: string = "URL_domain"
export const URL_SUBD: string = "URL_subdomain"
export const URL_QERY: string = "URL_query"
export const URL_HASH: string = "URL_hash"
export const URL_PAGE: string = "URL_page"
export const URL_PRSE: string = "fURL"
export const URL_NPRS: string = "unfURL"
export const URL = {
  FULL: URL_FULL,
  PATH: URL_PATH,
  DATA: URL_DATA,
  DOMN: URL_DOMN,
  SUBD: URL_SUBD,
  QERY: URL_QERY,
  HASH: URL_HASH,
  PAGE: URL_PAGE,
  PRSE: URL_PRSE,
  NPRS: URL_NPRS 
}

// userland router metadata constants
export const DOM_NODE: string = "DOM"
export const DOM_BODY: string = "BODY"
export const DOM_HEAD: string = "HEAD"
export const DOM = {
  NODE: DOM_NODE,
  BODY: DOM_BODY,
  HEAD: DOM_HEAD
}

// ROUTER
export const ROUTER_PREP: string = "prep"
export const ROUTER_POST: string = "post"
export const ROUTER_PRFX: string = "prefix"
export const ROUTER_RUTS: string = "router"
export const ROUTER = {
  PREP: ROUTER_PREP,
  POST: ROUTER_POST,
  PRFX: ROUTER_PRFX,
  RUTS: ROUTER_RUTS,
}
// set$$tate constants
export const STATE_PATH: string = "PATH"
export const STATE_DATA: string = "STATE"
export const STATE = {
  PATH: STATE_PATH,
  DATA: STATE_DATA
}

// state setting Command constants
export const CMD_SUB$: string = "sub$"
export const CMD_ARGS: string = "args"
export const CMD_RESO: string = "reso"
export const CMD_ERRO: string = "erro"
export const CMD_WORK: string = "handler"
export const CMD_SRC$: string = "source$"
export const CMD = {
  SUB$: CMD_SUB$,
  ARGS: CMD_ARGS,
  RESO: CMD_RESO,
  ERRO: CMD_ERRO,
  WORK: CMD_WORK,
  SRC$: CMD_SRC$
}

// boot config constants
export const CFG_RUN$: string = "run"
export const CFG_STOR: string = "state"
export const CFG_ROOT: string = "root"
export const CFG_VIEW: string = "app"
export const CFG_DRFT: string = "draft"
export const CFG_LOG$: string = "trace"
export const CFG = {
  RUN$: CFG_RUN$,
  STOR: CFG_STOR,
  ROOT: CFG_ROOT,
  VIEW: CFG_VIEW,
  DRFT: CFG_DRFT,
  LOG$: CFG_LOG$
}

// Global state keys/constants
export const ROUTE_PATH: string = "_ROUTE_PATH"
export const ROUTE_LOAD: string = "_ROUTE_LOADING"
export const ROUTE_VIEW: string = "_PAGE_TEMPLATE"
export const ROUTE_ROOT: string = "_ROOT"
export const ROUTE = {
  PATH: ROUTE_PATH,
  LOAD: ROUTE_LOAD,
  VIEW: ROUTE_VIEW,
  ROOT: ROUTE_ROOT
}


export const DEFAULT_CFG: Object = {
  [ROUTE_PATH]: null, // home page / defaults to empty path
  [ROUTE_LOAD]: true,
  [ROUTE_VIEW]: null,
  [ROUTE_ROOT]: null
}