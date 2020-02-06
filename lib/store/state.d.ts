/**
 * @module set$$tate
 * @format
 */
import { Atom } from "@thi.ng/atom";
export declare const $store$: Atom<Object>;
/**
 *
 * Swaps the current value at the given path/lens into the
 * global store with that of the given value. Checks to see
 * if that value should be either spread into an existing
 * object or a complete replacement
 */
export declare const set$$tate: (path: any, val: any, store?: Atom<Object>) => Object;
