"use strict";
/** @format */
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @example
 * diff_keys(["a", "b"], { a: 1, b: 2, c: 3, d: 4 })
 * //=> [ [ 'c', 'd' ], { c: 3, d: 4 } ]
 */
function diff_keys(nKeys, nObj) {
    if (nKeys === void 0) { nKeys = []; }
    if (nObj === void 0) { nObj = {}; }
    var all = Object.keys(nObj);
    var xKeys = all.filter(function (key) { return !nKeys.includes(key); });
    var xObj = Object.entries(nObj).reduce(function (a, _a) {
        var _b;
        var _c = __read(_a, 2), k = _c[0], v = _c[1];
        if (!nKeys.includes(k))
            return __assign(__assign({}, a), (_b = {}, _b[k] = v, _b));
        else
            return a;
    }, {});
    return [xKeys, xObj];
}
exports.diff_keys = diff_keys;
