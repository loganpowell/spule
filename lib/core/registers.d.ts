/**
 * @module Registration
 * @format
 */
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
export declare const registerRouter: (router: any) => {
    [x: string]: any;
};
/**
 *
 *  Part I: Needs to be a functional component to accept the
 *  `ctx` object to pass it to children
 *
 *  Part II: Takes the root RAF stream and updates the shell
 *  on every global state mutation
 *
 *  Part III: Connects the app shell to the state stream,
 *  which is triggered by any updates to the global
 *  `$store$`
 */
export declare const boot: (CFG: any) => Promise<void>;
