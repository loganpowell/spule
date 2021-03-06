"use strict";
/**
 * @module keys
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_FULL = "URL";
exports.URL_PATH = "URL_path";
exports.URL_DATA = "URL_data";
exports.URL_DOMN = "URL_domain";
exports.URL_SUBD = "URL_subdomain";
exports.URL_QERY = "URL_query";
exports.URL_HASH = "URL_hash";
exports.URL_PAGE = "URL_page";
exports.URL_PRSE = "parse";
exports.URL_NPRS = "unparse";
// public
exports.URL = {
    FULL: exports.URL_FULL,
    PATH: exports.URL_PATH,
    DATA: exports.URL_DATA,
    DOMN: exports.URL_DOMN,
    SUBD: exports.URL_SUBD,
    QERY: exports.URL_QERY,
    HASH: exports.URL_HASH,
    PAGE: exports.URL_PAGE,
    PRSE: exports.URL_PRSE,
    NPRS: exports.URL_NPRS
};
// userland router metadata constants
exports.DOM_NODE = "NODE";
exports.DOM_BODY = "BODY";
exports.DOM_HEAD = "HEAD";
// public
exports.DOM = {
    NODE: exports.DOM_NODE,
    BODY: exports.DOM_BODY,
    HEAD: exports.DOM_HEAD
};
// set$$tate constants
exports.STATE_PATH = "PATH";
exports.STATE_DATA = "DATA";
// public
exports.STATE = {
    PATH: exports.STATE_PATH,
    DATA: exports.STATE_DATA
};
// state setting Command constants
exports.CMD_SUB$ = "sub$";
exports.CMD_ARGS = "args";
exports.CMD_RESO = "reso";
exports.CMD_ERRO = "erro";
exports.CMD_WORK = "work";
exports.CMD_SRC$ = "src$";
// public
exports.CMD = {
    SUB$: exports.CMD_SUB$,
    ARGS: exports.CMD_ARGS,
    RESO: exports.CMD_RESO,
    ERRO: exports.CMD_ERRO,
    WORK: exports.CMD_WORK,
    SRC$: exports.CMD_SRC$
};
// boot config constants
exports.CFG_RUN$ = "run";
exports.CFG_STOR = "state";
exports.CFG_ROOT = "root";
exports.CFG_VIEW = "app";
exports.CFG_DRFT = "draft";
exports.CFG_LOG$ = "trace";
exports.CFG_RUTR = "router";
exports.CFG_KICK = "kick";
// public
exports.CFG = {
    RUN$: exports.CFG_RUN$,
    STOR: exports.CFG_STOR,
    ROOT: exports.CFG_ROOT,
    VIEW: exports.CFG_VIEW,
    DRFT: exports.CFG_DRFT,
    LOG$: exports.CFG_LOG$,
    RUTR: exports.CFG_RUTR,
    KICK: exports.CFG_KICK
};
// ROUTER
exports.ROUTER_PREP = "prep";
exports.ROUTER_POST = "post";
exports.ROUTER_PRFX = "prefix";
// public
exports.ROUTER = {
    PREP: exports.ROUTER_PREP,
    POST: exports.ROUTER_POST,
    PRFX: exports.ROUTER_PRFX,
    RUTR: exports.CFG_RUTR
};
// Global state keys/constants
exports.$$_PATH = "_ROUTE_PATH";
exports.$$_LOAD = "_ROUTE_LOADING";
exports.$$_VIEW = "_PAGE_TEMPLATE";
exports.$$_ROOT = "_ROOT";
// public
exports.$$ = {
    PATH: exports.$$_PATH,
    LOAD: exports.$$_LOAD,
    VIEW: exports.$$_VIEW,
    ROOT: exports.$$_ROOT
};
exports.$$_DEFAULT = (_a = {},
    _a[exports.$$_PATH] = null,
    _a[exports.$$_LOAD] = true,
    _a[exports.$$_VIEW] = null,
    _a[exports.$$_ROOT] = null,
    _a);
