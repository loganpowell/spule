/**
 * @module Routing
 * @format
 */
export declare const _URL__ROUTE: (CFG: any) => (acc: any) => any[];
/**
 *
 * `_URL__ROUTE_DOM`
 *
 * DOM Router that contains a cross-platform routing Subtask
 * `_URL__ROUTE`
 *
 *
 * Subtask HOF for router registration. Takes a
 * `@thi.ng/associative` `EquivMap` route matching function,
 * registers that router as a member of a Task for following
 * Commands to leverage the returned data (`{ data, page }`)
 *
 * Pseudo
 * ```
 * ( router ) => ({ URL, DOM event }) => [
 * - if href, push to `history.pushState`
 * - SUBTASK: _URL__ROUTE (universal router)
 * - remove `active` attribute from visited links except current
 * - notify rendertron (TBD) of new page
 * ]
 * ```
 *
 * reserved Command keys:
 * - `URL`
 * - `DOM`
 * - `URL_page`
 * - `URL_path`
 * - `URL_data`
 */
export declare const _URL_DOM__ROUTE: (CFG: any) => (acc: any) => {
    [x: string]: any;
}[];
