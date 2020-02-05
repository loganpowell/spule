"use strict";
/**
 * @module SET_STATE
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const keys_js_1 = require("../keys.js");
const store_1 = require("../store");
const register_js_1 = require("./register.js");
exports.createSetStateCMD = store => register_js_1.registerCMD({
    [keys_js_1.sub$_]: "SET_STATE",
    [keys_js_1.args_]: x => x,
    [keys_js_1.handler_]: args => store_1.set$$tate(args[keys_js_1.PATH_], args[keys_js_1.STATE_], store)
});
