"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module tasks/task$
 */
// explicit imports = prevent circular deps
var stream_1 = require("../core/stream$");
var multiplex_1 = require("../core/multiplex");
/**
 *
 * Task stream that handles Arrays of Commands. Dispatches
 * to `multiplex`er (the heart of `spule`)
 *
 */
exports.task$ = stream_1.run$.subscribeTopic(false, {
    next: multiplex_1.multiplex,
    error: console.warn
}, { id: "task$_stream" });
