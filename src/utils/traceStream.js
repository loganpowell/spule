import { trace } from "@thi.ng/rstream"

let fix_jsdoc

/**
 * ## `trace_stream`
 *
 * simple ad-hoc tracer to log one of the streams emmissions
 * @param {string} log_prefix A string that is prepended to
 *                  console.log's of emissions from the
 *                  stream
 * @param {stream}
 * */
export const traceStream = (log_prefix, stream) =>
  stream.subscribe(trace(log_prefix))
