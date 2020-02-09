"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var keys_js_1 = require("../keys.js");
var register_js_1 = require("./register.js");
var setFavicon = function (href) {
    var link = document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
};
// TODO currently throws CORS warning
var defalt_cfg = {
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
var replaceMeta = function (obj) {
    if (obj === void 0) { obj = defalt_cfg; }
    Object.entries(obj).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], val = _b[1];
        try {
            return {
                HEAD_title: function () {
                    document.title = val;
                },
                HEAD_meta: function () {
                    Object.entries(val).forEach(function (_a) {
                        var _b = __read(_a, 2), prop = _b[0], content = _b[1];
                        document.head.querySelector("meta[property=\"" + prop + "\"]").content = content;
                    });
                },
                HEAD_favicon: function () { return setFavicon(val); }
            }[key]();
        }
        catch (e) {
            console.warn(e);
        }
    });
};
var conformToHead = function (_a) {
    var _b = _a.title, title = _b === void 0 ? defalt_cfg.title : _b, _c = _a.description, description = _c === void 0 ? defalt_cfg.meta["og:description"] : _c, _d = _a.image, _e = _d.url, url = _e === void 0 ? defalt_cfg.meta["og:image"] : _e, _f = _d.height, height = _f === void 0 ? defalt_cfg.meta["og:image:height"] : _f, _g = _d.width, width = _g === void 0 ? defalt_cfg.meta["og:image:width"] : _g, _h = _a.favicon, favicon = _h === void 0 ? defalt_cfg.favicon : _h, _j = _a.type, type = _j === void 0 ? defalt_cfg.meta["og:type"] : _j;
    return ({
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
};
exports.INJECT_HEAD = register_js_1.registerCMD((_a = {},
    _a[keys_js_1.CMD_SUB$] = "_INJECT_HEAD",
    _a[keys_js_1.CMD_ARGS] = function (acc) {
        var _a;
        return (_a = {}, _a[keys_js_1.URL_DATA] = acc[keys_js_1.URL_DATA], _a);
    },
    _a[keys_js_1.CMD_WORK] = function (_a) {
        var _b = keys_js_1.URL_DATA, _c = keys_js_1.DOM_HEAD, _d = _a[_b][_c], title = _d.title, description = _d.description, image = _d.image, favicon = _d.favicon, type = _d.type;
        return replaceMeta(conformToHead({ title: title, description: description, image: image, favicon: favicon, type: type }));
    },
    _a));
