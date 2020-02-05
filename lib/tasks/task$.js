"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../core");
exports.task$ = core_1.run$.subscribeTopic(false, {
    next: core_1.multiplex,
    error: console.warn
}, { id: "task$_stream" });
