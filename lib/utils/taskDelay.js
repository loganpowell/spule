"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * Helper Promise wrapper to inject a delay into a Task
 */
exports.msTaskPromiseDelay = ms => new Promise(resolve => setTimeout(resolve, ms));
