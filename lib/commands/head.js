"use strict";
/**
 * @module INJECT_HEAD
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const keys_js_1 = require("../keys.js");
const register_js_1 = require("./register.js");
const setFavicon = href => {
    let link = document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
};
// TODO currently throws CORS warning
const defalt_cfg = {
    meta: {
        "og:title": "My thi.ng",
        "og:image": "https://github.com/loganpowell/ac/raw/master/assets/thing400x400.png",
        "og:image:width": 400,
        "og:image:height": 400,
        "og:description": "web app",
        "og:type": "website"
    },
    title: "My thi.ng",
    favicon: "https://github.com/loganpowell/ac/raw/master/assets/favicon.ico"
};
const replaceMeta = (obj = defalt_cfg) => {
    Object.entries(obj).forEach(([key, val]) => {
        try {
            return {
                HEAD_title: () => {
                    document.title = val;
                },
                HEAD_meta: () => {
                    Object.entries(val).forEach(([prop, content]) => {
                        document.head.querySelector(`meta[property="${prop}"]`).content = content;
                    });
                },
                HEAD_favicon: () => setFavicon(val)
            }[key]();
        }
        catch (e) {
            console.warn(e);
        }
    });
};
const conformToHead = ({ title = defalt_cfg.title, description = defalt_cfg.meta["og:description"], image: { url = defalt_cfg.meta["og:image"], height = defalt_cfg.meta["og:image:height"], width = defalt_cfg.meta["og:image:width"] }, favicon = defalt_cfg.favicon, type = defalt_cfg.meta["og:type"] }) => ({
    HEAD_meta: {
        /**
         * og:url can tell scrapers to ignore the page and
         * scrape this instead. Would save scraping the whole
         * page and might be friendlier for `jsdom`
         */
        // "og:url": history.state.URL,
        "og:title": title,
        "og:type": type,
        "og:description": description,
        "og:image:width": width,
        "og:image:height": height,
        "og:image": url
    },
    HEAD_title: title,
    HEAD_favicon: favicon
});
exports.INJECT_HEAD = register_js_1.registerCMD({
    // source$: DOMnavigated$,
    [keys_js_1.sub$_]: "INJECT_HEAD",
    [keys_js_1.args_]: acc => ({ [keys_js_1.URL_data_]: acc[keys_js_1.URL_data_] }),
    [keys_js_1.handler_]: ({ [keys_js_1.URL_data_]: { [keys_js_1.HEAD_]: { title, description, image, favicon, type } } }) => replaceMeta(conformToHead({ title, description, image, favicon, type }))
});
