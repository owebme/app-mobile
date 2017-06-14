(function(app, $, $dom, EV, _){

    app.define("plugins.screens");
    app.define("plugins.marquee.effects");

    app.plugins.screens = function(scope, options){
        this.active = false;
        this.scope = $(scope);
        this.options = options || {};
        this.state = null;
    };

    app.plugins.screens.prototype = {

        init: function(screen){
            var _this = this;

            if (this.active) return;

            this.scope.on('touchmove MSPointerMove', function(e){
        		e.preventDefault();
        	});

            this.scope.on('dragstart selectstart', function() {
                return false;
            });

            var options = {
                vertical: this.options.vertical === false ? false : true,
                screens: '.screen',
                effect: this.options.vertical === false ? 'space' : 'light',
                mousewheel: this.options.vertical === false ? false : this.options.mousewheel !== undefined ? this.options.mousewheel : true,
                activeClass: this.options.activeClass ? this.options.activeClass : this.options.hideSections !== false ? "screen--active" : false,
                spaceClass: this.options.vertical === false ? 'horizontal__space' : 'vertical__space',
                longClass: this.options.vertical === false ? false : 'screen--long',
                contentClass: this.options.vertical === false ? false : 'screen__content',
                hideSections: true,
                navPrev: this.options.navPrev,
        		navNext: this.options.navNext,
                phoneEmulate: this.options.phoneEmulate,
                duration: this.options.vertical === false ? (app.device.isPhone ? 375 : 450) : 500,
            }

            if (this.options) _.extend(options, this.options);

            this.options = options;
            this.items = [];

            var index = 100;
            this.scope.find(options.screens).each(function(i) {
                _this.items.push({
                    index: i,
                    title: this.getAttribute("data-" + (options.dataAttr ? options.dataAttr : "marquee"))
                })
                if (!options.vertical) this.style.zIndex = index;
                index--;
            });

            this.marquee = options.static ? app.plugins.marqueeStatic(this.scope, options) : app.plugins.marquee(this.scope, options);

            this.marquee.enable();

            this.marquee.scroll.on('scrollEnd', function(){
                _this.state = _this.marquee.section;
            });

            if (screen !== undefined) this.nav(screen, 0);

            if (app.device.isMobile && !this.options.phoneEmulate) this.embeds();

            if (this.options.play){
                this.play = new app.plugins.marquee.playScreens(this, this.options.play);
                this.play.init();
            }

            this.active = true;
        },

        nav: function(screen, duration){
            if (_.isNumber(screen)){
                if (screen > this.items.length - 1) screen = this.items.length - 1;
                this.marquee.scrollTo(screen, duration !== undefined ? duration : undefined);
            }
            else {
                if (!screen) return;
                var item = _.findWhere(this.items, {"title": screen});
                if (item && item.index) {
                    this.state = item.title;
                    this.marquee.scrollTo(item.index, duration !== undefined ? duration : undefined);
                }
            }
        },

        get: function(parameter){
    		return this.marquee[parameter];
    	},

        refresh: function(){
            this.marquee.resize();
        },

        refreshAll: function(){
            var index = this.marquee.index;
            this.destroy();
            this.init(index);
        },

        embeds: function(){
            var _this = this,
                state = null,
                $focus = null,
                resize = _.debounce(this.refresh, 300);

            $dom.window.on('resize.screens', function(){
                _this.scope.scrollTop(0);

                if (_this.options.static && state == "focus" && $focus){
                    setTimeout(function(){
                        centered(app.sizes.height / 1.3, 0);
                    }, 150);
                }
                if (_this.options.resizeRefresh) resize.call(_this);
        	});

            if (_this.options.static){
                this.scope.on("focus blur", "input[type='text'], textarea", function(e){
                    if (e.type == "focusin" || e.type == "focus"){
                        $focus = $(e.target);

                        state = "focus";

                        centered(app.sizes.height / 2.5, 400);
                    }
                    else {
                        state = "blur";
                    }
                    _this.scope.scrollTop(0);
                });
            }

            var centered = function(delta, duration){
                var top = $focus.offset().top;
                if (top < 0){
                    _this.marquee.scroll.scrollBy(0, (-top + delta), duration, (_this.options.static ? IScrollStatic.utils.ease.cubicOut : IScroll.utils.ease.cubicOut));
                }
                else if (top > delta){
                    _this.marquee.scroll.scrollBy(0, -(top - delta), duration, (_this.options.static ? IScrollStatic.utils.ease.cubicOut : IScroll.utils.ease.cubicOut));
                }
            };
        },

        destroy: function(){
            this.scope.off();
            this.marquee.scroll.off();
            this.marquee.destroy();
            if (this.options.play){
                this.play.destroy();
            }
            $dom.window.off('resize.screens');
            this.active = false;
        }
    };

})(app, $, app.$dom, app.events, app.utils);
