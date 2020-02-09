export const URL_FULL: string = "URL"
export const URL_PATH: string = "URL_path"
export const URL_DATA: string = "URL_data"
export const URL_DOMN: string = "URL_domain"
export const URL_SUBD: string = "URL_subdomain"
export const URL_QERY: string = "URL_query"
export const URL_HASH: string = "URL_hash"
export const URL_PAGE: string = "URL_page"
export const URL_PRSE: string = "parse"
export const URL_NPRS: string = "unparse"

// public
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
export const DOM_NODE: string = "NODE"
export const DOM_BODY: string = "BODY"
export const DOM_HEAD: string = "HEAD"

// public
export const DOM = {
  NODE: DOM_NODE,
  BODY: DOM_BODY,
  HEAD: DOM_HEAD
}

// set$$tate constants
export const STATE_PATH: string = "PATH"
export const STATE_DATA: string = "DATA"

// public
export const STATE = {
  PATH: STATE_PATH,
  DATA: STATE_DATA
}

// state setting Command constants
export const CMD_SUB$: string = "sub$"
export const CMD_ARGS: string = "args"
export const CMD_RESO: string = "reso"
export const CMD_ERRO: string = "erro"
export const CMD_WORK: string = "work"
export const CMD_SRC$: string = "src$"

// public
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
export const CFG_RUTR: string = "router"
export const CFG_KICK: string = "kick"

// public
export const CFG = {
  RUN$: CFG_RUN$,
  STOR: CFG_STOR,
  ROOT: CFG_ROOT,
  VIEW: CFG_VIEW,
  DRFT: CFG_DRFT,
  LOG$: CFG_LOG$,
  RUTR: CFG_RUTR,
  KICK: CFG_KICK
}

// ROUTER
export const ROUTER_PREP: string = "prep"
export const ROUTER_POST: string = "post"
export const ROUTER_PRFX: string = "prefix"

// public
export const ROUTER = {
  PREP: ROUTER_PREP,
  POST: ROUTER_POST,
  PRFX: ROUTER_PRFX,
  RUTR: CFG_RUTR
}

// Global state keys/constants
export const $$_PATH: string = "_ROUTE_PATH"
export const $$_LOAD: string = "_ROUTE_LOADING"
export const $$_VIEW: string = "_PAGE_TEMPLATE"
export const $$_ROOT: string = "_ROOT"

// public
export const $$ = {
  PATH: $$_PATH,
  LOAD: $$_LOAD,
  VIEW: $$_VIEW,
  ROOT: $$_ROOT
}

export const $$_DEFAULT: Object = {
  [$$_PATH]: null, // home page / defaults to empty path
  [$$_LOAD]: true,
  [$$_VIEW]: null,
  [$$_ROOT]: null
}
