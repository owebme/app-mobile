(function(app, $, $dom, EV, _){

    app.define("plugins.easing.createBezier");

    var m = app.plugins.easing.Ease;
    var k = app.plugins.easing.KeySpline;
    var n = "Bezier curve expects exactly four (4) numbers. Given: ";

    function l(r, b, s, c) {
        var a = Array.prototype.slice.call(arguments);
        var f = a.every(function(p) {
            return (typeof p === "number")
        });
        if (a.length !== 4 || !f) {
            throw new TypeError(n + a)
        }
        var d = new k(r, b, s, c);
        var h = function(q, w, p, v) {
            return d.get(q / v) * p + w
        };
        var g = "cubic-bezier(" + a.join(", ") + ")";
        return new m(h, g)
    }

    app.plugins.easing.createBezier = l;

})(app, $, app.$dom, app.events, app.utils);
