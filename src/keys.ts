export const DOM_ : string = "DOM"
export const URL_ : string = "URL"
export const URL_path_ : string = "URL_path"
export const URL_data_ : string = "URL_data"
export const URL_domain_ : string = "URL_domain"
export const URL_subdomain_ : string = "URL_subdomain"
export const URL_query_ : string = "URL_query"
export const URL_hash_ : string = "URL_hash"
export const URL_page_ : string = "URL_page"
export const FURL : string = "fURL"

// userland router metadata constants
export const BODY_ : string = "BODY"
export const HEAD_ : string = "HEAD"
export const prep_ : string = "prep"
export const post_ : string = "post"
export const prefix_ : string = "prefix"
export const router_ : string = "router"

// set$$tate constants
export const PATH_ : string = "PATH"
export const STATE_ : string = "STATE"

// state setting Command constants
export const sub$_ : string = "sub$"
export const args_ : string = "args"
export const reso_ : string = "reso"
export const erro_ : string = "erro"
export const handler_ : string = "handler"
export const source$_ : string = "source$"

// boot config constants
export const run_ : string = "run"
export const state_ : string = "state"
export const root_ : string = "root"
export const app_ : string = "app"
export const draft_ : string = "draft"
export const trace_ : string = "trace"

// Global state keys/constants
export const ROUTE_PATH_ : string = "_ROUTE_PATH"
export const ROUTE_LOADING_ : string = "_ROUTE_LOADING"
export const PAGE_TEMPLATE_ : string = "_PAGE_TEMPLATE"
export const ROOT_ : string = "_ROOT"


export const DEFAULT_CFG : Object = {
  [ROUTE_PATH_]: null, // home page / defaults to empty path
  [ROUTE_LOADING_]: true,
  [PAGE_TEMPLATE_]: null,
  [ROOT_]: null
}