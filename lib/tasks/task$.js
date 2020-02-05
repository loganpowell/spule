"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream__js_1 = require("../core/stream$.js");
var multiplex_js_1 = require("../core/multiplex.js");
exports.task$ = stream__js_1.run$.subscribeTopic(false, {
    next: multiplex_js_1.multiplex,
    error: console.warn
}, { id: "task$_stream" });
