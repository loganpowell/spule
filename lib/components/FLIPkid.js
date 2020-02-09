"use strict";
/**
 * @module FLIP
 * @format
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
var commands_1 = require("../commands");
var keys_js_1 = require("../keys.js");
var err_str = function (prop) { return "\n  No '" + prop + "' property found on FLIPkid firstChild. \n  Ensure you are providing FLIPkid a component with an \n  attributes object as its second argument with a " + prop + "\n  property for proper FLIP routing.\n"; };
// const [tag, attrs, ..._args] = kid(ctx, ...args)
// const { href } = attrs
var sim_event = function (href) { return ({
    currentTarget: { document: null },
    target: {
        href: href
    }
}); };
/**
 * FLIP (First Last Invert Play) Animating component. Wraps
 * a component that has an `href` attribute and uses it to
 * trigger a routing event and FLIP animation between
 * instances on separate routes (provides a "magic
 * move"-like UX)
 *
 */
exports.FLIPkid = Object.freeze({
    render: function (ctx) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        // console.log("FLIPkid"),
        return __spread([
            "div",
            {
                onclick: function (ev) {
                    var _a, _b;
                    ev.preventDefault();
                    var target = ev.target;
                    var href = target.getAttribute("href");
                    // console.log({ target, href })
                    if (!href)
                        return new Error(err_str("href"));
                    ctx[keys_js_1.CFG_RUN$]([
                        __assign(__assign({}, commands_1.HURL), (_a = {}, _a[keys_js_1.CMD_ARGS] = sim_event(href), _a)),
                        __assign(__assign({}, commands_1.FLIP_FIRST), (_b = {}, _b[keys_js_1.CMD_ARGS] = { id: href, target: target }, _b))
                    ]);
                }
            }
        ], rest);
    },
    init: function (el, ctx) {
        var _a;
        // console.log({
        //   el,
        //   firstChild: el.firstChild,
        //   id: el.firstChild.getAttribute("href")
        // }),
        ctx[keys_js_1.CFG_RUN$](__assign(__assign({}, commands_1.FLIP_LAST_INVERSE_PLAY), (_a = {}, _a[keys_js_1.CMD_ARGS] = {
            element: el.firstChild,
            id: el.firstChild.getAttribute("href")
        }, _a)));
    }
});
