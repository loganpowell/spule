
// parse_URL constants
export const DOM = "DOM"
export const URL = "URL"
export const URL_path = "URL_path"
export const URL_data = "URL_data"
export const URL_domain = "URL_domain"
export const URL_subdomain = "URL_subdomain"
export const URL_query = "URL_query"
export const URL_hash = "URL_hash"
export const URL_page = "URL_page"

// userland router metadata constants
export const BODY = "BODY"
export const HEAD = "HEAD"
export const pre = "pre"
export const post = "post"
export const prefix = "prefix"
export const router = "router"

// state setting Command constants
export const sub$ = "sub$"
export const args = "args"
export const reso = "reso"
export const erro = "erro"
export const handler = "handler"
export const source$ = "source$"
export const STATE = "STATE"
export const PATH = "PATH"

// boot config constants
export const run = "run"
export const state = "state"
export const root = "root"
export const app = "app"
export const draft = "draft"
export const trace = "trace"

// Global state keys/constants
export const ROUTE_PATH = "_ROUTE_PATH"
export const ROUTE_LOADING = "_ROUTE_LOADING"
export const PAGE_TEMPLATE = "_PAGE_TEMPLATE"
export const ROOT = "_ROOT"

export const DEFAULT_CFG = {
  [ROUTE_PATH]: null, // home page / defaults to empty path
  [ROUTE_LOADING]: true,
  [PAGE_TEMPLATE]: null,
  [ROOT]: null
}