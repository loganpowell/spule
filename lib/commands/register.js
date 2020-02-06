"use strict";
/**
 * @module Registration
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const associative_1 = require("@thi.ng/associative");
const transducers_1 = require("@thi.ng/transducers");
const checks_1 = require("@thi.ng/checks");
const keys_js_1 = require("../keys.js");
const stream__js_1 = require("../core/stream$.js");
const utils_1 = require("../utils");
const feedCMD$fromSource$ = cmd => {
    const sub$ = cmd[keys_js_1.CMD_SUB$];
    const args = cmd[keys_js_1.CMD_ARGS];
    const isFn = checks_1.isFunction(args);
    const deliver = x => ({ [keys_js_1.CMD_SUB$]: sub$, [keys_js_1.CMD_ARGS]: args(x) });
    const delivery = { [keys_js_1.CMD_SUB$]: sub$, [keys_js_1.CMD_ARGS]: args };
    const feed = $ => isFn ? transducers_1.map(x => $.next(deliver(x))) : transducers_1.map(() => $.next(delivery));
    return cmd[keys_js_1.CMD_SRC$].subscribe(feed(stream__js_1.command$));
};
let registered = new associative_1.EquivMap();
const err_str = "command Registration `registerCMD`";
/**
 *
 *
 * Takes a Command object with some additional information
 * and returns a Command `run`able in a Task or as-is.
 *
 * ### Example
 *
 * ```js
 * const genie = {
 *   sub$: "GENIE",
 *   args: "your wish"
 *   work: x => console.log("🧞 says:", x, "is my command")
 * }
 *
 * const GENIE = registerCMD(genie)
 *
 * run(GENIE)
 * // 🧞 says: your wish is my command
 * ```
 *
 * A Command object can have four keys:
 *  1. `sub$` (required)
 *  2. `args` (optional, sets default) during registration
 *  3. `work` (required)
 *  4. `src$` (optional, enables stream to feed Command)
 *
 */
function registerCMD(command) {
    const sub$ = command[keys_js_1.CMD_SUB$];
    const args = command[keys_js_1.CMD_ARGS];
    const erro = command[keys_js_1.CMD_ERRO];
    const reso = command[keys_js_1.CMD_RESO];
    const src$ = command[keys_js_1.CMD_SRC$];
    const work = command[keys_js_1.CMD_WORK];
    const knowns = [
        keys_js_1.CMD_SUB$,
        keys_js_1.CMD_ARGS,
        keys_js_1.CMD_RESO,
        keys_js_1.CMD_ERRO,
        keys_js_1.CMD_SRC$,
        keys_js_1.CMD_WORK
    ];
    const [unknowns] = utils_1.diff_keys(knowns, command);
    // console.log({ knowns, unknowns })
    if (unknowns.length > 0) {
        throw new Error(utils_1.xKeyError(err_str, command, unknowns, sub$, undefined));
    }
    if (src$)
        feedCMD$fromSource$(command);
    // @ts-ignore
    stream__js_1.out$.subscribeTopic(sub$, { next: work, error: console.warn }, transducers_1.map(puck => puck[keys_js_1.CMD_ARGS]));
    const CMD = reso
        ? {
            [keys_js_1.CMD_SUB$]: sub$,
            [keys_js_1.CMD_ARGS]: args,
            [keys_js_1.CMD_RESO]: reso,
            [keys_js_1.CMD_ERRO]: erro
        }
        : { [keys_js_1.CMD_SUB$]: sub$, [keys_js_1.CMD_ARGS]: args };
    // Set.add not supported by IE
    if (registered.set) {
        if (registered.has(sub$)) {
            throw new Error(`

🔥 duplicate \`sub$\` value detected in Command:
${utils_1.stringify_w_functions(CMD)}
existing registered Commands:
${JSON.stringify([...registered.keys()], null, 2)}
🔥 Please use a different/unique Command \`sub$\` string

🔎 Inspect existing Commands using js Map API \`registerCMD.all\`
🔎 (\`registerCMD.all.entries()\`, \`registerCMD.all.has("X")\`, etc.)

        `);
        }
        registered.set(sub$, CMD);
    }
    return CMD;
}
exports.registerCMD = registerCMD;
/**
 * enables inspection of the existing Command registrations
 * if using Chrome, there's an additional advantage of being
 * able to find the `[[FunctionLocation]]` of the Command
 */
registerCMD.all = registered;
