"use strict";
/**
 * @module set$$tate
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("@thi.ng/atom");
const checks_1 = require("@thi.ng/checks");
const keys_js_1 = require("../keys.js");
// Global $store$ Container from [@thi.ng/atom](http://thi.ng/atom)
exports.$store$ = new atom_1.Atom(keys_js_1.DEFAULT_CFG);
/**
 *
 * Swaps the current value at the given path/lens into the
 * global store with that of the given value. Checks to see
 * if that value should be either spread into an existing
 * object or a complete replacement
 */
exports.set$$tate = (path, val, store = exports.$store$) => store.swapIn(path, (x) => !path.length && !checks_1.isPlainObject(val)
    ? Object.assign(Object.assign({}, x), { [Object.keys(val)[0]]: val }) : checks_1.isPlainObject(x) && checks_1.isPlainObject(val)
    ? Object.assign(Object.assign({}, x), val) : val);
