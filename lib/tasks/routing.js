"use strict";
/**
 * @module Routing
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const checks_1 = require("@thi.ng/checks");
const store_1 = require("../store");
const commands_1 = require("../commands");
const keys_js_1 = require("../keys.js");
const utils_1 = require("../utils");
const SET_STATE = commands_1.createSetStateCMD(store_1.$store$);
/**
 *
 * Universal router (cross-platform) Subtask.
 *
 * This can be used in both a browser and Node context. The
 * parts that handle browser side-effects are included in an
 * Supertask `_URL__ROUTE`
 *
 * Pseudo
 * ```
 * ( router ) => ({ URL }) => [
 *  - set `router_loading` path in global atom to `true`
 *  - call provided `router` with the `URL` and await payload
 *  - `parse_URL(URL)` for `URL_*` components
 *  - set `route_path` in global store/atom to current `URL_path`
 *  - set page state (data, path & page component name) in store
 *  - once promise(s) resolved, set `router_loading` to `false`
 * ]
 * ```
 * reserved Command keys:
 *  - `URL_page`
 *  - `URL_data`
 *  - `URL_path`
 *  - `URL`
 *  - `DOM`
 */
exports.URL__ROUTE = CFG => {
    let router, preroute, postroute, prefix;
    if (checks_1.isObject(CFG)) {
        const ruts = CFG[keys_js_1.CFG_RUTR];
        const prep = CFG[keys_js_1.ROUTER_PREP];
        const post = CFG[keys_js_1.ROUTER_POST];
        const prfx = CFG[keys_js_1.ROUTER_PRFX] || null;
        const escRGX = /[-/\\^$*+?.()|[\]{}]/g;
        const escaped = string => string.replace(escRGX, "\\$&");
        // console.log({ router, pre, post })
        router = ruts;
        preroute = checks_1.isObject(prep) ? [prep] : prep || [];
        postroute = checks_1.isObject(post) ? [post] : post || [];
        prefix = prfx ? new RegExp(escaped(prfx), "g") : null;
    }
    else {
        router = CFG;
        preroute = [];
        postroute = [];
        prefix = null;
    }
    return acc => [
        ...preroute,
        /**
         * ## `_SET_ROUTER_LOADING_STATE`cod
         *
         * Routing Command: Universal
         *
         * ### Payload: static
         * default payload `args` signature:
         * ```
         * args: true,
         * ```
         * Simple true or false payload to alert handler
         *
         * ### Handler: side-effecting
         * Sets `route_loading` path in global Atom to true || false
         *
         */
        {
            [keys_js_1.CMD_ARGS]: prefix
                ? router(acc[keys_js_1.URL_FULL].replace(prefix, ""))
                : router(acc[keys_js_1.URL_FULL]),
            [keys_js_1.CMD_RESO]: (_acc, _res) => ({
                [keys_js_1.URL_PAGE]: _res[keys_js_1.URL_PAGE],
                [keys_js_1.URL_DATA]: _res[keys_js_1.URL_DATA]
            }),
            [keys_js_1.CMD_ERRO]: (_acc, _err) => console.warn("Error in __URL__ROUTE:", _err, "constructed:", _acc)
        },
        { [keys_js_1.CMD_ARGS]: prefix ? utils_1.unfURL(acc[keys_js_1.URL_FULL], prefix) : utils_1.unfURL(acc[keys_js_1.URL_FULL]) },
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.CMD_ARGS]: _acc => ({
                [keys_js_1.STATE_DATA]: _acc[keys_js_1.URL_PATH],
                [keys_js_1.STATE_PATH]: [keys_js_1.ROUTE_PATH]
            }) }),
        ...postroute
    ];
};
/**
 *
 * DOM Router that contains a cross-platform routing Subtask
 *
 * Subtask HOF for router registration. Takes a
 * `@thi.ng/associative` `EquivMap` route matching function,
 * registers that router as a member of a Task for following
 * Commands to leverage the returned data (`{ data, page }`)
 *
 * Pseudo
 * ```
 * ( router ) => ({ URL, DOM event }) => [
 *  - if href, push to `history.pushState`
 *  - SUBTASK: _URL__ROUTE (universal router)
 *  - remove `active` attribute from visited links except current
 *  - notify rendertron (TBD) of new page
 * ]
 * ```
 *
 * reserved Command keys:
 *  - `URL`
 *  - `DOM`
 *  - `URL_page`
 *  - `URL_path`
 *  - `URL_data`
 */
exports.URL_DOM__ROUTE = CFG => {
    // instantiate router
    const match = exports.URL__ROUTE(CFG);
    return acc => [
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.CMD_ARGS]: {
                [keys_js_1.STATE_PATH]: [keys_js_1.ROUTE_LOAD],
                [keys_js_1.STATE_DATA]: true
            } }),
        Object.assign(Object.assign({}, commands_1.HREF_PUSHSTATE_DOM), { [keys_js_1.CMD_ARGS]: { [keys_js_1.URL_FULL]: acc[keys_js_1.URL_FULL], [keys_js_1.DOM_NODE]: acc[keys_js_1.DOM_NODE] } }),
        // example Subtask injection
        ACC => match({ [keys_js_1.URL_FULL]: ACC[keys_js_1.URL_FULL] }),
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.CMD_ARGS]: _acc => ({
                [keys_js_1.STATE_PATH]: [keys_js_1.ROUTE_VIEW],
                [keys_js_1.STATE_DATA]: _acc[keys_js_1.URL_PAGE]
            }) }),
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.CMD_ARGS]: _acc => ({
                [keys_js_1.STATE_PATH]: _acc[keys_js_1.URL_PATH],
                [keys_js_1.STATE_DATA]: _acc[keys_js_1.URL_DATA][keys_js_1.DOM_BODY] || _acc[keys_js_1.URL_DATA]
            }) }),
        // example ad-hoc stream injection
        // { sub$: log$, args: () => ({ DOM }) },
        commands_1.SET_LINK_ATTRS_DOM,
        Object.assign(Object.assign({}, SET_STATE), { 
            // wait on pending promise(s) w/a non-nullary fn (+)=>
            [keys_js_1.CMD_ARGS]: _ => ({
                [keys_js_1.STATE_PATH]: [keys_js_1.ROUTE_LOAD],
                [keys_js_1.STATE_DATA]: false
            }) }),
        commands_1.NOTIFY_PRERENDER_DOM
    ];
};
