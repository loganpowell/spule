"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
function diff_keys(nKeys = [], nObj = {}) {
    const all = Object.keys(nObj);
    const xKeys = all.filter(key => !nKeys.includes(key));
    const xObj = Object.entries(nObj).reduce((a, [k, v]) => {
        if (!nKeys.includes(k))
            return Object.assign(Object.assign({}, a), { [k]: v });
        else
            return a;
    }, {});
    return [xKeys, xObj];
}
exports.diff_keys = diff_keys;
// diff_keys(["a", "b"], { a: 1, b: 2, c: 3, d: 4 }) //?
// diff_keys([1, 2, 3]) //?
