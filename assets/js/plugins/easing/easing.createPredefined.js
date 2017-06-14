(function(app, $, $dom, EV, _){

    app.define("plugins.easing.createPredefined");

    var l = app.plugins.easing.createStep;
    var o = app.plugins.easing.cssAliases;
    var r = app.plugins.easing.fn;
    var m = app.plugins.easing.Ease;
    var n = 'Easing function "%TYPE%" not recognized among the following: ' + Object.keys(r).join(", ");

    function k(b) {
        var a;
        if (b === "step-start") {
            return l(1, "start")
        } else {
            if (b === "step-end") {
                return l(1, "end")
            } else {
                a = r[b]
            }
        }
        if (!a) {
            throw new Error(n.replace("%TYPE%", b))
        }
        return new m(a, o[b])
    }

    app.plugins.easing.createPredefined = k;

})(app, $, app.$dom, app.events, app.utils);
