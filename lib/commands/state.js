"use strict";
/**
 * @module SET_STATE
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
var keys_js_1 = require("../keys.js");
var store_1 = require("../store");
var register_js_1 = require("./register.js");
exports.createSetStateCMD = function (store) {
    var _a;
    return register_js_1.registerCMD((_a = {},
        _a[keys_js_1.sub$_] = "SET_STATE",
        _a[keys_js_1.args_] = function (x) { return x; },
        _a[keys_js_1.handler_] = function (args) { return store_1.set$$tate(args[keys_js_1.PATH_], args[keys_js_1.STATE_], store); },
        _a));
};
