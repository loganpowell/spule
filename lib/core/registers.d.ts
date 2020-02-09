/**
 *
 * expects payload of
 * ```
 * { target: { location: { href } }, currentTarget }
 * ```
 */
export declare const registerRouterDOM: (router: any) => {
    [x: string]: any;
};
/**
 *
 * Options Object keys
 * - root   : DOM mount node
 * - app    : root application node
 * - draft  : state scaffolding Object
 * - router : url matching function or config Object
 * - trace  : string triggers logs prepended with it
 * - kick   : boolean triggers kickstart (for some sandboxes)
 * - prefix : ignore a part of the URL (e.g., gitub.io/<prefix>)
 *
 */
export declare const boot: (CFG: Object) => void;
