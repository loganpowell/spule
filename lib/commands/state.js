"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module commands/state
 */
var keys_js_1 = require("../keys.js");
var store_1 = require("../store");
var register_js_1 = require("./register.js");
/**
 *
 * Higher-order function that takes a `@thi.ng/Atom` state
 * container and returns a Command object for setting that
 * Atom's state by the provided path
 */
exports.createSetStateCMD = function (store) {
    var _a;
    return register_js_1.registerCMD((_a = {},
        _a[keys_js_1.CMD_SUB$] = "_SET_STATE",
        _a[keys_js_1.CMD_ARGS] = function (x) { return x; },
        _a[keys_js_1.CMD_WORK] = function (args) { return store_1.set$$tate(args[keys_js_1.STATE_PATH], args[keys_js_1.STATE_DATA], store); },
        _a));
};
