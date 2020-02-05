/**
 * Uses a JSON.stringify "replacer" function to preserve a
 * small (truncated) version of the function signature for
 * Object values that contain them
 *
 * @format
 */
export declare const stringify_w_functions: (x: any, indent: any) => string;
export declare const key_index_err: (c: any, i: any) => string;
/**
 *
 * `uknown_key_ERR`
 *
 * Just a  little error for people defining commands
 * that makes sure their keys don't contain typos
 */
export declare const x_key_ERR: (str: any, c: any, unknown: any, sub$: any, index: any) => string;
