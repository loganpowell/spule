/** @format */
/**
 * ### `stringify_type`
 *
 * just a little convenience function takes some value and
 * returns a string representation of its type this makes it
 * easier to create a switch statement using types
 *
 * powered by [@thi.ng/checks](http://thi.ng/checks)
 *
 */
export declare const stringify_type: (x: any) => "THUNK" | "FUNCTION" | "PROMISE" | "OBJECT" | "type_str NOT FOUND";
