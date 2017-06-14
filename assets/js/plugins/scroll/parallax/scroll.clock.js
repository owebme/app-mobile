(function(app, $, $dom, EV, _){

    app.define("plugins.scroll.clock");

    function n() {
        o.call(this), this.lastFrameTime = null, this._animationFrame = null, this._active = !1, this._startTime = null, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._getTime = Date.now || function() {
            return (new Date).getTime()
        }
    }
    var r, o = app.commons.EventEmitterMicro;
    (new Date).getTime();
    r = n.prototype = new o(null), r.start = function() {
        this._active || this._tick()
    }, r.stop = function() {
        this._active && _.caf(this._animationFrame), this._animationFrame = null, this.lastFrameTime = null, this._active = !1
    }, r.destroy = function() {
        this.stop(), this.off();
        var t;
        for (t in this) this.hasOwnProperty(t) && (this[t] = null)
    }, r.isRunning = function() {
        return this._active
    }, r._tick = function() {
        this._active || (this._active = !0), this._animationFrame = _.raf(this._boundOnAnimationFrame)
    }, r._onAnimationFrame = function(t) {
        null === this.lastFrameTime && (this.lastFrameTime = t);
        var e = t - this.lastFrameTime,
            i = 0;
        if (e >= 1e3 && (e = 0), 0 !== e && (i = 1e3 / e), this._firstFrame === !0 && (e = 0, this._firstFrame = !1), 0 === i) this._firstFrame = !0;
        else {
            var n = {
                time: t,
                delta: e,
                fps: i,
                naturalFps: i,
                timeNow: this._getTime()
            };
            this.trigger("update", n), this.trigger("draw", n)
        }
        this._animationFrame = null, this.lastFrameTime = t, this._active !== !1 ? this._tick() : this.lastFrameTime = null
    };

    app.plugins.scroll.clock = n;

})(app, $, app.$dom, app.events, app.utils);
