"use strict";
/**
 * @module core/stream$
 */
Object.defineProperty(exports, "__esModule", { value: true });
var rstream_1 = require("@thi.ng/rstream");
var transducers_1 = require("@thi.ng/transducers");
var keys_1 = require("../keys");
/**
 * User-land event dispatch stream
 *
 * This stream is directly exposed to users. Any one-off
 * Commands `next`ed into this stream are sent to the
 * `command$` stream. Arrays of Commands (Tasks) are sent to
 * the `task$` stream.
 *
 * TODO: add examples,`beforeunload` event handler within #4
 *    (orphan): SEE https://youtu.be/QQukWZcIptM and enable
 *    ctx.run.cancel() via external or internal events
 *    (e.g., popstate / { sub$:  "cancel" })
 *
 */
exports.run$ = rstream_1.pubsub({
    topic: function (x) { return !!x[keys_1.CMD_SUB$]; },
    id: "run$_stream",
    equiv: function (x, y) { return x === y || y === "_TRACE_STREAM"; }
});
/**
 *
 * Primary user-land _READ_ stream. For attaching handlers
 * for responding to emmitted Commands
 */
exports.out$ = rstream_1.pubsub({
    topic: function (x) { return x[keys_1.CMD_SUB$]; },
    id: "out$_stream",
    equiv: function (x, y) { return x === y || y === "_TRACE_STREAM"; }
});
/**
 *
 * Primary fork/bisect stream for indivual commands.
 * attached to a `pubsub` stemming from this stream. The
 * `topic` function used to alert downstream handlers is a
 * simple lookup of the `sub$` key of the command
 */
exports.command$ = exports.run$.subscribeTopic(true, {
    next: function (x) { return exports.out$.next(x); },
    error: console.warn
}, { id: "command$_stream" });
// @ts-ignore
exports.popstate$ = rstream_1.fromDOMEvent(window, "popstate");
// @ts-ignore
exports.DOMContentLoaded$ = rstream_1.fromDOMEvent(window, "DOMContentLoaded");
// example of custom stream dispatch (logging)
/**
 *
 * There are three types of navigation we need to handle:
 * 1. DOMContentLoaded (entering the site) events
 * 2. popstate (browser back/forward button clicks) events
 * 3. `<a hurl="x">` (link clicking)
 *
 * These events have different payloads and need to be
 * harmonized in order to use them consistently
 *
 * ## getting the `hurl` property from the various events:
 * 1. ev.target.location.hurl
 * 2. ev.target.location.hurl
 * 3. ev.target.hurl
 *
 * for raw events, we can just transform them, but for link
 * clicking we need to convert/wrap it to align with the
 * destructuring of the others
 *
 * see _HURL in `/commands/routing.js` for ad-hoc stream
 * injection example
 */
exports.DOMnavigated$ = rstream_1.merge({
    src: [exports.popstate$, exports.DOMContentLoaded$]
}).transform(transducers_1.map(function (x) {
    var _a;
    return (_a = {},
        _a[keys_1.URL_FULL] = x.target.location.href,
        _a[keys_1.DOM_NODE] = x.currentTarget,
        _a);
}));
