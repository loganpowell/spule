"use strict";
/**
 * Uses a JSON.stringify "replacer" function to preserve a
 * small (truncated) version of the function signature for
 * Object values that contain them
 *
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify_w_functions = (x, indent) => JSON.stringify(x, (key, value) => {
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
exports.key_index_err = (c, i) => {
    const idx_dict0 = Array.from(Array(19).keys()).reduce((a, idx) => (Object.assign(Object.assign({}, a), { [idx]: `${idx + 1}th` })), {});
    const idx_dict = Object.assign(Object.assign({}, idx_dict0), { 0: "1st", 1: "2nd", 2: "3rd" });
    const idx_str = idx_dict[i];
    return `🔍 it was the ${idx_str} Command in a Task or ${idx_dict[i - 1]} in a Subtask.`;
};
// prettier-ignore
/**
 *
 * `uknown_key_ERR`
 *
 * Just a  little error for people defining commands
 * that makes sure their keys don't contain typos
 */
exports.xKeyError = (str, c, unknown, sub$, index) => {
    const { source$ } = c;
    const count = Object.entries(c).length;
    return `

  🔥 ${str} ERROR:
  
  🔥 Unrecognized Command Key(s)
  
  FAULTY sub$: "${sub$}" 
  ${Object.keys(unknown)[0][0]
        ? `
  ${index ? exports.key_index_err(c, index) : ""}

  The problematic entry/entries: 

  🤔 ${!index && count > 3 && !source$ ? `${Object.entries(unknown)[0][0]}: <Stream>` : exports.stringify_w_functions(unknown, 2)}`
        : ""} 🤔

  ACCEPTABLE ENTRY KEYS ${index ? "WITHIN A COMMAND" : "DURING REGISTRATION"}: 

  'sub$' 
    - optional 
    - topic key for for registering & targeting Commands 
    - signatures:
      - "X"    : String: Topic key
      - XX$    : Stream: for dispatching args to custom stream

  'args' 
    - required 
    - payload or accumulator reshaping payload function (Promises OK)
    - signatures:
      - PRI    : primitive: static payload -> is NOT accumulated
      - {?}    : object: static payload -> is accumulated 
      - (+) => : function (non-nullary): dispatch payload from 
                values accumulated from prior Command payloads
      - (0) => : thunk (nullary): dispatch to custom stream
      - {P}    : Promise or (#) => {P} Promise returning function
      
  'reso' 
    - required for Promise handling 
    - converts resolved Promise payloads to Command args
    - signature:
      - ({A: accumulator}, {P: resolved Promise}) =>  

  'erro' 
    - recommended for Promise rejections 
    - handles rejected Promise payloads
    - signature:
      - ({A: accumulator}, {E: error object}) =>  
  ${index ? ``
        : `
  'handler' 
    - required 
    - function that is called on payload's arrival
    - signature: 
      - (#) => : function instruments actual side-effects/work 
  
  'source$' 
    - advanced/optional 
    - source stream (see http://thi.ng/rstream)`}

  Hope that helps!
  `;
};
