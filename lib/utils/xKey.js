"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Uses a JSON.stringify "replacer" function to preserve a
 * small (truncated) version of the function signature for
 * Object values that contain them
 *
 * @format
 */
exports.stringify_w_functions = function (x, indent) {
    return JSON.stringify(x, function (key, value) {
        if (typeof value === "function") {
            return (value
                .toString()
                .replace(/\r?\n|\r/g, "")
                .replace(/\s\s+/g, " ")
                .slice(0, 12) + "...");
        }
        else {
            return value;
        }
    }, indent);
};
exports.key_index_err = function (c, i) {
    var idx_dict0 = Array.from(Array(19).keys()).reduce(function (a, idx) {
        var _a;
        return (__assign(__assign({}, a), (_a = {}, _a[idx] = idx + 1 + "th", _a)));
    }, {});
    var idx_dict = __assign(__assign({}, idx_dict0), { 0: "1st", 1: "2nd", 2: "3rd" });
    var idx_str = idx_dict[i];
    return "\uD83D\uDD0D it was the " + idx_str + " Command in a Task or " + idx_dict[i - 1] + " in a Subtask.";
};
// prettier-ignore
/**
 *
 * `uknown_key_ERR`
 *
 * Just a  little error for people defining commands
 * that makes sure their keys don't contain typos
 */
exports.xKeyError = function (str, c, unknown, sub$, index) {
    var source$ = c.source$;
    var count = Object.entries(c).length;
    return "\n\n  \uD83D\uDD25 " + str + " ERROR:\n  \n  \uD83D\uDD25 Unrecognized Command Key(s)\n  \n  FAULTY sub$: \"" + sub$ + "\" \n  " + (Object.keys(unknown)[0][0]
        ? "\n  " + (index ? exports.key_index_err(c, index) : "") + "\n\n  The problematic entry/entries: \n\n  \uD83E\uDD14 " + (!index && count > 3 && !source$ ? Object.entries(unknown)[0][0] + ": <Stream>" : exports.stringify_w_functions(unknown, 2))
        : "") + " \uD83E\uDD14\n\n  ACCEPTABLE ENTRY KEYS " + (index ? "WITHIN A COMMAND" : "DURING REGISTRATION") + ": \n\n  'sub$' \n    - optional \n    - topic key for for registering & targeting Commands \n    - signatures:\n      - \"X\"    : String: Topic key\n      - XX$    : Stream: for dispatching args to custom stream\n\n  'args' \n    - required \n    - payload or accumulator reshaping payload function (Promises OK)\n    - signatures:\n      - PRI    : primitive: static payload -> is NOT accumulated\n      - {?}    : object: static payload -> is accumulated \n      - (+) => : function (non-nullary): dispatch payload from \n                values accumulated from prior Command payloads\n      - (0) => : thunk (nullary): dispatch to custom stream\n      - {P}    : Promise or (#) => {P} Promise returning function\n      \n  'reso' \n    - required for Promise handling \n    - converts resolved Promise payloads to Command args\n    - signature:\n      - ({A: accumulator}, {P: resolved Promise}) =>  \n\n  'erro' \n    - recommended for Promise rejections \n    - handles rejected Promise payloads\n    - signature:\n      - ({A: accumulator}, {E: error object}) =>  \n  " + (index ? ""
        : "\n  'handler' \n    - required \n    - function that is called on payload's arrival\n    - signature: \n      - (#) => : function instruments actual side-effects/work \n  \n  'source$' \n    - advanced/optional \n    - source stream (see http://thi.ng/rstream)") + "\n\n  Hope that helps!\n  ";
};
