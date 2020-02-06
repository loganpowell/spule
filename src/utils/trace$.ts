/** @format */

import { trace } from "@thi.ng/rstream"

/**
 * ## `trace_stream`
 *
 * allows for logging emissions to a provided stream
 * */
export const trace$ = (log_prefix: string, stream) =>
  stream.subscribeTopic
    ? stream.subscribeTopic("_TRACE_STREAM", {
        next: x => console.log(log_prefix, x),
        error: console.warn
      })
    : stream.subscribe(trace(log_prefix))
