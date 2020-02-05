"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module Routing
 * @format
 */
var utils_1 = require("../utils");
var stream__js_1 = require("../core/stream$.js");
var keys_js_1 = require("../keys.js");
var register_js_1 = require("./register.js");
/**
 * we need to transform the payload to align with the
 * object structure of the native DOM events ('popstate'
 * and 'DOMContentLoaded') payloads, so they're
 * transformed correctly by the `navigated$` stream
 * transforms
 */
exports.HURLer = function (ev) {
    // ev.preventDefault()
    // console.log({ e })
    var href = ev.target.href;
    var w_href = window.location.href;
    var parsed = utils_1.fURL(w_href);
    var w_path = "/" + parsed[keys_js_1.URL_path_].join("/");
    // handle both absolute and root relative paths
    if (href === w_href || href === w_path)
        return;
    stream__js_1.DOMnavigated$.next({
        target: { location: { href: href } },
        currentTarget: ev.currentTarget
    });
    return ev;
};
exports.HURL = register_js_1.registerCMD((_a = {},
    _a[keys_js_1.sub$_] = "HURL",
    _a[keys_js_1.args_] = function (ev) { return ev; },
    _a[keys_js_1.handler_] = exports.HURLer,
    _a));
var setLinkAttrs = function (target) {
    document.body.querySelectorAll("a[visited]").forEach(function (el) {
        if (el.href === window.location.href)
            el.setAttribute("active", "");
        else
            el.removeAttribute("active");
    });
    if (target.setAttribute) {
        target.setAttribute("visited", "");
        target.setAttribute("active", "");
    }
};
/**
 * ## `_SET_LINK_ATTRS_DOM`
 *
 * Routing Command: DOM-specific
 *
 * ### Payload: function
 * default payload `args` signature:
 * ```
 * args: ({ DOM }) => ({ DOM }),
 * ```
 * Input = DOM node reference
 *
 * ### Handler: side-effecting
 * Takes a DOM reference and queries all visited links. Sets
 * current/clicked link as active and sets visted links that
 * don't match current URL to inactive see `setLinkAttrs`
 * function
 *
 */
exports.__SET_LINK_ATTRS_DOM = register_js_1.registerCMD((_b = {},
    _b[keys_js_1.sub$_] = "__SET_LINK_ATTRS_DOM",
    _b[keys_js_1.args_] = function (acc) {
        var _a;
        return (_a = {}, _a[keys_js_1.DOM_] = acc[keys_js_1.DOM_], _a);
    },
    _b[keys_js_1.handler_] = function (args) { return setLinkAttrs(args[keys_js_1.DOM_]); },
    _b));
/**
 * ## `_HREF_PUSHSTATE_DOM`
 *
 * Routing Command: DOM-specific
 *
 * ### Payload: function
 * default payload `args` signature:
 * ```
 * args: ({ URL, DOM }) => ({ URL, DOM }),
 * ```
 * Takes a URL and a DOM reference
 *
 * ### Handler: side-effecting
 * If the DOM reference is an `<a>` element, uses
 * `history.pushState` to add the clicked URL (plus the
 * parsed URL from `parse_URL(URL)`) to the `history` object
 *
 * export const DOMnavigated$ = merge({
 *   src: [popstate$, DOMContentLoaded$]
 * }).transform(map(x => ({ URL: x.target.location.href, DOM: x.currentTarget })))
 *
 *
 */
exports.__HREF_PUSHSTATE_DOM = register_js_1.registerCMD((_c = {},
    _c[keys_js_1.sub$_] = "__HREF_PUSHSTATE_DOM",
    _c[keys_js_1.args_] = function (acc) {
        var _a;
        return (_a = {}, _a[keys_js_1.URL_] = acc[keys_js_1.URL_], _a[keys_js_1.DOM_] = acc[keys_js_1.DOM_], _a);
    },
    _c[keys_js_1.handler_] = function (args) {
        return !args[keys_js_1.DOM_].document
            ? history.pushState(utils_1.fURL(args[keys_js_1.URL_]), null, args[keys_js_1.URL_])
            : null;
    },
    _c));
/**
 * ## `_NOTIFY_PRERENDER_DOM`
 *
 * ### Payload: static
 * default payload `args` signature
 * ```
 * args: true,
 * ```
 * ### Handler: side-effecting
 * Routing Command: DOM-specific (used for manually
 * triggering `rendertron` prerenderer for bots/web-crawlers
 *
 *
 * TODO: `jsdom` prerender testing
 *
 * basic `http` server that returns static content for
 * certain user-agents
 *
 * import { JSDOM } from "jsdom"
 *
 * const document = (new JSDOM(...)).window.document
 * document.addEventListener("rendered", () => {...scrape
 * stuff here...
 * })
 *
 *
 */
exports.__NOTIFY_PRERENDER_DOM = register_js_1.registerCMD((_d = {},
    _d[keys_js_1.sub$_] = "__NOTIFY_PRERENDER_DOM",
    _d[keys_js_1.args_] = true,
    //👀 for prerenderer,
    _d[keys_js_1.handler_] = function () { return document.dispatchEvent(new Event("rendered")); },
    _d));
