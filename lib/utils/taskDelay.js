"use strict";
/**
 * @module utils/taskDelay
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * Helper Promise wrapper to inject a delay into a Task
 */
exports.msTaskPromiseDelay = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
