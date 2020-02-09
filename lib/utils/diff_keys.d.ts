/**
 * @module utils/diff_keys
 */
/**
 *
 * @example
 * diff_keys(["a", "b"], { a: 1, b: 2, c: 3, d: 4 })
 * //=> [ [ 'c', 'd' ], { c: 3, d: 4 } ]
 */
export declare function diff_keys(nKeys?: any[], nObj?: {}): any[];
