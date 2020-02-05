"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msTaskPromiseDelay = function (t) { return new Promise(function (resolve) { return setTimeout(resolve, t); }); };
