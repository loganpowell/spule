
export const DOM_ = "DOM"
export const URL_ = "URL"
export const URL_path_ = "URL_path"
export const URL_data_ = "URL_data"
export const URL_domain_ = "URL_domain"
export const URL_subdomain_ = "URL_subdomain"
export const URL_query_ = "URL_query"
export const URL_hash_ = "URL_hash"
export const URL_page_ = "URL_page"

// userland router metadata constants
export const BODY_ = "BODY"
export const HEAD_ = "HEAD"
export const prep_ = "prep"
export const post_ = "post"
export const prefix_ = "prefix"
export const router_ = "router"

// state setting Command constants
export const sub$_ = "sub$"
export const args_ = "args"
export const reso_ = "reso"
export const erro_ = "erro"
export const handler_ = "handler"
export const source$_ = "source$"

// boot config constants
export const run_ = "run"
export const state_ = "state"
export const root_ = "root"
export const app_ = "app"
export const draft_ = "draft"
export const trace_ = "trace"

// Global state keys/constants
export const ROUTE_PATH_ = "_ROUTE_PATH"
export const ROUTE_LOADING_ = "_ROUTE_LOADING"
export const PAGE_TEMPLATE_ = "_PAGE_TEMPLATE"
export const ROOT_ = "_ROOT"

export const DEFAULT_CFG = {
  [ROUTE_PATH_]: null, // home page / defaults to empty path
  [ROUTE_LOADING_]: true,
  [PAGE_TEMPLATE_]: null,
  [ROOT_]: null
}