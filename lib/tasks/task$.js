"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module tasks/task$
 */
// explicit imports = prevent circular deps
var stream__js_1 = require("../core/stream$.js");
var multiplex_js_1 = require("../core/multiplex.js");
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
