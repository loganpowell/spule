"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checks_1 = require("@thi.ng/checks");
// prettier-ignore
/**
 * ### `stringify_type`
 *
 * just a little convenience function takes some value and
 * returns a string representation of its type this makes it
 * easier to create a switch statement using types
 *
 * powered by [@thi.ng/checks](http://thi.ng/checks)
 *
 */
exports.stringify_type = function (x) {
    if (checks_1.isFunction(x) && x.length === 0)
        return "THUNK";
    if (checks_1.isFunction(x) && x.length > 0)
        return "FUNCTION";
    if (checks_1.isPromise(x))
        return "PROMISE";
    if (checks_1.isObject(x))
        return "OBJECT";
    return "type_str NOT FOUND";
};
