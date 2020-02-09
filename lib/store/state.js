"use strict";
/**
 * @module store/state
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
Object.defineProperty(exports, "__esModule", { value: true });
var atom_1 = require("@thi.ng/atom");
var checks_1 = require("@thi.ng/checks");
var keys_js_1 = require("../keys.js");
// Global $store$ Container from [@thi.ng/atom](http://thi.ng/atom)
exports.$store$ = new atom_1.Atom(keys_js_1.$$_DEFAULT);
/**
 *
 * Swaps the current value at the given path/lens into the
 * global store with that of the given value. Checks to see
 * if that value should be either spread into an existing
 * object or a complete replacement
 */
exports.set$$tate = function (path, val, store) {
    if (store === void 0) { store = exports.$store$; }
    return store.swapIn(path, function (x) {
        var _a;
        return !path.length && !checks_1.isPlainObject(val)
            ? __assign(__assign({}, x), (_a = {}, _a[Object.keys(val)[0]] = val, _a)) : checks_1.isPlainObject(x) && checks_1.isPlainObject(val)
            ? __assign(__assign({}, x), val) : val;
    });
};
