(function(app, $, $dom, EV, _){

    app.define("plugins.scroll.parallax");

    app.plugins.scroll.parallax = function(options){

        if (!options) return;

        this.ready = false;
        this.scroll = $(options.scroll);
        this.scope = options.container ? $(options.container) : null;
        this.scopeOffsetTop = this.scope ? options.container.offset().top : null;
        this.scopeHeight = this.scope ? options.container.height() : null;
        this.fade = options.fade;
        this._items = options.items;
        this.items = [];
    };

    app.plugins.scroll.parallax.prototype = {

        start: function(render){
            var _this = this;

            if (!this.ready || render) this.render();

            if (this.items.length){

                (function scrollParallax(){
                    _this.raf = _.raf(scrollParallax);
                    if (_this.ready) _this.onScroll(_this);
                })();
            }
        },

        render: function(){
            var _this = this;

            this.items = [];

            if (this._items){
                _.each(this._items, function(item, i){
                    _this.items.push(item);
                    _this.items[i].cHeights = {
                        large: 4e3,
                        medium: 3e3,
                        small: 2800
                    };
                    _this.items[i].it = 0;

                    if (_this.scope){
                        _this.items[i].offset = {
                            top: _this.scopeOffsetTop,
                            height: _this.scopeHeight
                        }
                        _this.items[i].scope = _this.scope;
                    }
                    else if (!_this.scope && item.container){
                        _this.items[i].scope = $dom.body.find(item.container);
                        _this.items[i].offset = {
                            top: _this.items[i].scope.offset().top,
                            height: _this.items[i].scope.height()
                        }
                    }
                    _this.items[i].$elem = _this.items[i].scope.find(item.selector);
                    if (_this.items[i].$elem.css("transform") == "none"){
                        _this.items[i].$elem.css("transform", "translateZ(0)");
                    }
                });
            }

            this.ready = true;
        },

        onScroll: function(_this){
            var scrollTop = _this.scroll[0].scrollTop || _this.scroll[0].scrollY,
                delta = scrollTop + app.sizes.height;

            _this.items.forEach(function(item, i){
                var viewport = item.viewports.large,
                    scroll = scrollTop - item.offset.top;

                if (delta > item.offset.top && scrollTop < item.offset.top + item.offset.height + 10){

                    if (item.offset.top > app.sizes.height) scroll += app.sizes.height;

                    item.cHeight = 1 - item.offset.height / item.cHeights.large;
                    item.progress = scroll / item.offset.height;
                    item.t = _this.smoothstep(viewport.fromTime, viewport.toTime, item.progress);
                    item.t *= item.cHeight;
                    item.t = _this.clamp(item.t, 0, 1);
                    item.t += item.it;
                    item.it < -1e-6 ? item.it *= .955 : item.it = 0;
                    item.y = _this.lerp(viewport.fromY, viewport.toY, item.t);

                    if (_this.fade){
                        var opacity = item.progress;
                        if (item.offset.top > app.sizes.height) opacity -= 1;
                        if (opacity < 1.01 && opacity > -1e-6){
                            if (_this.fade.in){
                                _this.fade.in.elem.css("opacity", opacity);
                            }
                            if (_this.fade.out){
                                _this.fade.out.elem.css("opacity", (1 - opacity));
                            }
                        }
                    }

                    //console.log(item.cHeight, item.progress, item.t, item.it);

                    var transform = item.$elem.css("transform").match(/matrix\(\d+, ?\d+, ?\d+, ?\d+, ?(\-?\d+), ?(\-?\d+)/);

                    if (transform && transform[1]){
                        item.x = transform[1];
                        _this.update(item.$elem, item.x, item.y);
                    }
                }
            });
        },

        update: function($elem, x, y){
            $elem.css("transform", "translate3d(" + x + "px, " + y + "px, 0)");
        },

        clamp: function(t, e, i) {
            return Math.max(e, Math.min(i, t));
        },
        normalize: function(t, e, i) {
            return (t - e) / (i - e);
        },
        smoothstep: function(t, e, i) {
            var o = this.clamp(this.normalize(i, t, e), 0, 1);
            return o * o * (3 - 2 * o);
        },
        lerp: function(t, e, i) {
            return t + (e - t) * i;
        },

        destroy: function(){
            _.caf(this.raf);
            this.ready = false;
        }
    };

})(app, $, app.$dom, app.events, app.utils);
