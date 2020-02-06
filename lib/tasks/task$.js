"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// explicit imports = prevent circular deps
const stream__js_1 = require("../core/stream$.js");
const multiplex_js_1 = require("../core/multiplex.js");
/**
 *
 * Task stream that handles Arrays of Commands. Dispatches
 * to `multiplex`er (the heart of `spule`)
 *
 */
exports.task$ = stream__js_1.run$.subscribeTopic(false, {
    next: multiplex_js_1.multiplex,
    error: console.warn
}, { id: "task$_stream" });
