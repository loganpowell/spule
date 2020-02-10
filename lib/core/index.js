"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var registers_1 = require("./registers");
exports.boot = registers_1.boot;
// , registerRouter
exports.registerRouterDOM = registers_1.registerRouterDOM;
var multiplex_1 = require("./multiplex");
exports.multiplex = multiplex_1.multiplex;
var stream_1 = require("./stream$");
exports.DOMnavigated$ = stream_1.DOMnavigated$;
exports.DOMContentLoaded$ = stream_1.DOMContentLoaded$;
exports.command$ = stream_1.command$;
exports.out$ = stream_1.out$;
exports.popstate$ = stream_1.popstate$;
exports.run$ = stream_1.run$;
