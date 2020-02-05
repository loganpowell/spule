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
    [keys_js_1.CMD_SUB$]: "_SET_STATE",
    [keys_js_1.CMD_ARGS]: x => x,
    [keys_js_1.CMD_WORK]: args => store_1.set$$tate(args[keys_js_1.STATE_PATH], args[keys_js_1.STATE_DATA], store)
});
