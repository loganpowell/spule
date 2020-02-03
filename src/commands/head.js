/**
 * @module Commands: INJECT_HEAD
 * @format
 */

import { registerCMD } from "../register"
import { URL_data_, sub$_, args_, handler_, HEAD_ } from "../store"

const setFavicon = href => {
  let link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link")
  link.type = "image/x-icon"
  link.rel = "shortcut icon"
  link.href = href
  document.getElementsByTagName("head")[0].appendChild(link)
}

const replaceMeta = (obj = defalt_cfg) => {
  Object.entries(obj).forEach(([key, val]) => {
    try {
      return {
        HEAD_title: () => {
          document.title = val
        },
        HEAD_meta: () => {
          Object.entries(val).forEach(([prop, content]) => {
            document.head.querySelector(
              `meta[property="${prop}"]`
            ).content = content
          })
        },
        HEAD_favicon: () => setFavicon(val)
      }[key]()
    } catch (e) {
      console.warn(e)
    }
  })
}

const defalt_cfg = {
  meta: {
    "og:title": "My thi.ng",
    "og:image":
      "https://github.com/loganpowell/ac/raw/master/assets/thing400x400.png",
    "og:image:width": 400,
    "og:image:height": 400,
    "og:description": "web app",
    "og:type": "website"
  },
  title: "My thi.ng",
  favicon: "https://github.com/loganpowell/ac/raw/master/assets/favicon.ico"
}

const conform_head = ({
  title = defalt_cfg.meta.title,
  description = defalt_cfg.meta["og:description"],
  image: {
    url = defalt_cfg.meta["og:image"],
    height = defalt_cfg.meta["og:image:height"],
    width = defalt_cfg.meta["og:image:width"]
  },
  favicon = defalt_cfg.favicon,
  type = defalt_cfg.meta["og:type"]
}) => ({
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
})

export const INJECT_HEAD = registerCMD({
  // source$: DOMnavigated$,
  [sub$_]: "INJECT_HEAD",
  [args_]: acc => ({ [URL_data_]: acc[URL_data_] }),
  [handler_]: ({
    [URL_data_]: {
      [HEAD_]: { title, description, image, favicon, type }
    }
  }) => replaceMeta(conform_head({ title, description, image, favicon, type }))
})
