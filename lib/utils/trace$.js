"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const rstream_1 = require("@thi.ng/rstream");
/**
 * ## `trace_stream`
 *
 * allows for logging emissions to a provided stream
 * */
exports.trace$ = (log_prefix, stream) => stream.subscribeTopic
    ? stream.subscribeTopic("_TRACE_STREAM", {
        next: x => console.log(log_prefix, x),
        error: console.warn
    })
    : stream.subscribe(rstream_1.trace(log_prefix));
