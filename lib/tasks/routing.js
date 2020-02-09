"use strict";
/**
 * @module tasks/routing
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var checks_1 = require("@thi.ng/checks");
var store_1 = require("../store");
var commands_1 = require("../commands");
var keys_js_1 = require("../keys.js");
var utils_1 = require("../utils");
var SET_STATE = commands_1.createSetStateCMD(store_1.$store$);
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
exports.URL__ROUTE = function (CFG) {
    var router, preroute, postroute, prefix;
    if (checks_1.isObject(CFG)) {
        var ruts = CFG[keys_js_1.CFG_RUTR];
        var prep = CFG[keys_js_1.ROUTER_PREP];
        var post = CFG[keys_js_1.ROUTER_POST];
        var prfx = CFG[keys_js_1.ROUTER_PRFX] || null;
        var escRGX_1 = /[-/\\^$*+?.()|[\]{}]/g;
        var escaped = function (string) { return string.replace(escRGX_1, "\\$&"); };
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
    return function (acc) {
        var _a, _b, _c;
        return __spread(preroute, [
            (_a = {},
                _a[keys_js_1.CMD_ARGS] = prefix
                    ? router(acc[keys_js_1.URL_FULL].replace(prefix, ""))
                    : router(acc[keys_js_1.URL_FULL]),
                _a[keys_js_1.CMD_RESO] = function (_acc, _res) {
                    var _a;
                    return (_a = {},
                        _a[keys_js_1.URL_PAGE] = _res[keys_js_1.URL_PAGE],
                        _a[keys_js_1.URL_DATA] = _res[keys_js_1.URL_DATA],
                        _a);
                },
                _a[keys_js_1.CMD_ERRO] = function (_acc, _err) {
                    return console.warn("Error in URL__ROUTE:", _err, "constructed:", _acc);
                },
                _a),
            (_b = {},
                _b[keys_js_1.CMD_ARGS] = prefix ? utils_1.parse(acc[keys_js_1.URL_FULL], prefix) : utils_1.parse(acc[keys_js_1.URL_FULL]),
                _b),
            __assign(__assign({}, SET_STATE), (_c = {}, _c[keys_js_1.CMD_ARGS] = function (_acc) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.STATE_DATA] = _acc[keys_js_1.URL_PATH],
                    _a[keys_js_1.STATE_PATH] = [keys_js_1.$$_PATH],
                    _a);
            }, _c))
        ], postroute);
    };
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
exports.URL_DOM__ROUTE = function (CFG) {
    // instantiate router
    var match = exports.URL__ROUTE(CFG);
    return function (acc) {
        var _a, _b, _c, _d, _e, _f, _g;
        return [
            __assign(__assign({}, SET_STATE), (_a = {}, _a[keys_js_1.CMD_ARGS] = (_b = {},
                _b[keys_js_1.STATE_PATH] = [keys_js_1.$$_LOAD],
                _b[keys_js_1.STATE_DATA] = true,
                _b), _a)),
            __assign(__assign({}, commands_1.HREF_PUSHSTATE_DOM), (_c = {}, _c[keys_js_1.CMD_ARGS] = (_d = {}, _d[keys_js_1.URL_FULL] = acc[keys_js_1.URL_FULL], _d[keys_js_1.DOM_NODE] = acc[keys_js_1.DOM_NODE], _d), _c)),
            // example Subtask injection
            function (ACC) {
                var _a;
                return match((_a = {}, _a[keys_js_1.URL_FULL] = ACC[keys_js_1.URL_FULL], _a));
            },
            __assign(__assign({}, SET_STATE), (_e = {}, _e[keys_js_1.CMD_ARGS] = function (_acc) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.STATE_PATH] = [keys_js_1.$$_VIEW],
                    _a[keys_js_1.STATE_DATA] = _acc[keys_js_1.URL_PAGE],
                    _a);
            }, _e)),
            __assign(__assign({}, SET_STATE), (_f = {}, _f[keys_js_1.CMD_ARGS] = function (_acc) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.STATE_PATH] = _acc[keys_js_1.URL_PATH],
                    _a[keys_js_1.STATE_DATA] = _acc[keys_js_1.URL_DATA][keys_js_1.DOM_BODY] || _acc[keys_js_1.URL_DATA],
                    _a);
            }, _f)),
            // example ad-hoc stream injection
            // { sub$: log$, args: () => ({ DOM }) },
            commands_1.SET_LINK_ATTRS_DOM,
            __assign(__assign({}, SET_STATE), (_g = {}, _g[keys_js_1.CMD_ARGS] = function (_) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.STATE_PATH] = [keys_js_1.$$_LOAD],
                    _a[keys_js_1.STATE_DATA] = false,
                    _a);
            }, _g)),
            commands_1.NOTIFY_PRERENDER_DOM
        ];
    };
};
