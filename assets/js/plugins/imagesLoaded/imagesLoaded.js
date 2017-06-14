(function(app, $, $dom, EV, _){

    app.define("plugins.imagesLoaded");

    app.plugins.imagesLoaded = function(options){
        this.loadingOptions = null;
        this.els = [];
        this.loadingQueue = null;
        this._queueItems = [];
        this._queueItemsObj = {};
        this._loadOrder = [];
        this._timeout = null;
        this._didCallLoad = false
        this.options = {
            container: document.body,
            includeContainer: false
        };
        _.extend(this.options, options);
    };

    app.plugins.imagesLoaded.prototype = {
        load: function(options) {
            if (this._didCallLoad) {
                return
            }
            this._didCallLoad = true;
            this.loadingOptions = {
                loadingPoolSize: 8,
                timeout: null,
                imageClassName: "progressive-image"
            };
            _.extend(this.loadingOptions, options);
            this.loadingQueue = new app.plugins.imagesLoaded.LiveQueue(this.loadingOptions.loadingPoolSize);
            var q = this._getProgressiveClassName(),
                p = "." + q;
            this.els = this.options.container.querySelectorAll(p);
            if (this.options.includeContainer && this.options.container.classList.contains(q)) {
                this.els.unshift(this.options.container)
            }
            var s, o = this.els.length,
                t;
            for (s = 0; s < o; s++) {
                t = {
                    queueItem: this.loadingQueue.enqueue(this._loadNextItem.bind(this, s), s),
                    el: this.els[s],
                    id: s
                };
                this._queueItems.push(t);
                this._queueItemsObj[s] = t
            }
            this.loadingQueue.start();
            if (typeof this.loadingOptions.timeout === "number") {
                this._timeout = setTimeout(this.cancel.bind(this), this.loadingOptions.timeout)
            }
        },
        setVisible: function(o) {
            o.classList.remove(this.loadingOptions.imageClassName)
        },
        cancel: function() {
            if (this.els) {
                var p, o = this.els.length;
                for (p = 0; p < o; p++) {
                    this.setVisible(this.els[p])
                }
            }
            this._handleLoadingComplete()
        },
        destroy: function() {
            this.cancel();
            this.off();
            this.destroy();
        },
        _loadNextItem: function(o) {
            return new Promise(function(p, r, q) {
                var s = this._queueItemsObj[p];
                this._loadAndSetVisible(s.el).then(function() {
                    var t = this._queueItems.indexOf(s);
                    this._queueItems.splice(t, 1);
                    this._queueItemsObj[s.id] = null;
                    r();
                    this._handleImageLoad(s.el);
                    s = r = null;
                    if (this.loadingQueue.count() === 1) {
                        this._handleLoadingComplete()
                    }
                }.bind(this))
            }.bind(this, o))
        },
        _loadAndSetVisible: function(o) {
            this.setVisible(o);
            var p = this._getBackgroundImageSrc(o);
            return this._loadImage(p)
        },
        _getBackgroundImageSrc: function(p) {
            var o = p.currentStyle;
            if (!o) {
                o = window.getComputedStyle(p, false)
            }
            if (o.backgroundImage.indexOf("url(") === 0) {
                return o.backgroundImage.slice(4, -1).replace(/"/g, "")
            }
            return null
        },
        _getProgressiveClassName: function() {
            return this.loadingOptions.imageClassName
        },
        _loadImage: function(o) {
            return new Promise(this._loadImagePromiseFunc.bind(this, o))
        },
        _loadImagePromiseFunc: function(s, r, q) {
            function p() {
                this.removeEventListener("load", p);
                r(this);
                r = null
            }
            if (!s) {
                r(null);
                return
            }
            var o = new Image();
            o.addEventListener("load", p);
            o.src = s
        },
        _clearTimeout: function() {
            if (this._timeout) {
                window.clearTimeout(this._timeout);
                this._timeout = null
            }
        },
        _handleImageLoad: function(o) {
            this.trigger("image-load", o)
        },
        _handleLoadingComplete: function() {
            this.loadingQueue.stop();
            this._clearTimeout();
            this.trigger("complete")
        }
    };

    _.extend(app.plugins.imagesLoaded.prototype, new app.commons.EventEmitterMicro());

})(app, $, app.$dom, app.events, app.utils);
