/** @module Constants */


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

/** 
 * parse_URL constants
 * 
 * | URL component key | description |
 * | --- | --- |        
 * | DOM           | DOM node target                                           |
 * | URL           | full URL/route                                            |
 * | URL_path      | route path as array                                       |
 * | URL_domain    | top-level domain as array                                 |
 * | URL_subdomain | subdomain as array                                        |
 * | URL_query     | node querystring parsed URL parameters                    |
 * | URL_hash      | hash string to/from URL if any                            |
 * | URL_data      | data returned by router                                   |
 * | URL_page      | page component to render URL_data with                    |
 * 
 * | router config key | description |
 * | --- | --- |        
 * | HEAD          | metadata wrapper for router (targets DOM <head>)          |
 * | BODY          | data wrapper for router                                   |                        
 * | prep          | pre-router behavior Task/Command injection                |
 * | post          | post=router behavior Task/Command injection               |
 * | prefix        | URL path string for the router to ignore                  |
 * | router        | @thi.ng/EquivMap pattern matching function                |
 * 
 * | Command key | description |
 * | --- | --- |        
 * | sub$          | Command primary/unique key (topic subscription)           |
 * | args          | multiple signature intra-Task Command state see [Spule]() |
 * | reso          | intra-Command resolver of Promise args                    | 
 * | erro          | intra-Command handler for Promise args rejetions          |
 * | handler       | where Commands' actual "work" is done (side-fx/mutations) |
 * | source$       | upstream (source stream) Command connector                |
 * 
 * | boot config key | description |
 * | --- | --- |        
 * | run           | primary userland dispatch function                        |
 * | state         | global immutable state container                          |
 * | root          | DOM mount node for application                            |
 * | app           | root application view                                     |
 * | trace         | enable logging of every global state update               |
 * | draft         | state shape scaffolding                                   |
 * 
 */
export const DEFAULT_CFG = {
  [ROUTE_PATH_]: null, // home page / defaults to empty path
  [ROUTE_LOADING_]: true,
  [PAGE_TEMPLATE_]: null,
  [ROOT_]: null
}