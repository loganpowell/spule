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
/**
 * There're only 3 lifecycle hooks. render is called for
 * every update and is just providing the actual hiccup for
 * that component. if that component is used the first time,
 * the order is normalizeTree -> render -> diff -> init.
 * The actual DOM element is only known when init is called,
 * NEVER during render (though you could cache it as local
 * component state). If during diffing it turns out the
 * component is not used anymore, then release will be
 * called
 *
 * if the object identity of your life cycle component
 * changes with every update then that count as full
 * replacement and would trigger init each time:
 *
 * https://github.com/thi-ng/umbrella/wiki/Higher-order-components
 *
 * init is called in so called "post-order", i.e. when it
 * executes all children are already present in the DOM (and
 * might have had their init hooks called) first time = 1st
 * frame the component appears in the DOM
 *
 */
var err_str = function (prop) { return "\n  No '" + prop + "' property found on FLIPkid firstChild. \n  Ensure you are providing FLIPkid a component with an \n  attributes object as its second argument with a " + prop + "\n  property for proper FLIP routing.\n"; };
// const [tag, attrs, ..._args] = kid(ctx, ...args)
// const { href } = attrs
var sim_event = function (href) { return ({
    currentTarget: { document: null },
    target: {
        href: href
    }
}); };
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
                    ctx[keys_js_1.run_]([
                        __assign(__assign({}, commands_1.HURL), (_a = {}, _a[keys_js_1.args_] = sim_event(href), _a)),
                        __assign(__assign({}, commands_1.FLIP_FIRST), (_b = {}, _b[keys_js_1.args_] = { id: href, target: target }, _b))
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
        ctx[keys_js_1.run_](__assign(__assign({}, commands_1.FLIP_LAST_INVERSE_PLAY), (_a = {}, _a[keys_js_1.args_] = {
            element: el.firstChild,
            id: el.firstChild.getAttribute("href")
        }, _a)));
    }
});
