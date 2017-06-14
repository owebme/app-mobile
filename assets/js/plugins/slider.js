(function(app, $, $dom, EV, _){

    app.define("plugins.slider");

    app.plugins.slider = function(scope){
        this.active = false;
        this.index = 0;
        this.scope = $(scope);
        this.slider = this.scope.find(".slider__wrapper");
        this.nav = {
            prev: this.scope.find(".slider__nav__prev"),
            next: this.scope.find(".slider__nav__next")
        };

        this.init();
        this.render();
    };

    app.plugins.slider.prototype = {

        init: function(){
            var _this = this;

            this.nav.next.on('click', function(){
        		_this.nextSlides();
        	});

        	this.nav.prev.on('click', function(){
        		_this.prevSlides();
        	});

            this.slider.on('swipeLeft', function(){
                if (!_this.nav.next.hasClass('slider__nav--hidden')){
                    _this.nextSlides();
                }
            });

            this.slider.on('swipeRight', function(){
                if (!_this.nav.prev.hasClass('slider__nav--hidden')){
                    _this.prevSlides();
                }
            });
        },

        render: function(){
            var _this = this;

            this.sizeSlider = this.slider.width();
            this.firstSlide = this.slider.find(".slider__item:first");
            this.widthSlide = this.firstSlide.width();
            this.cnt = Math.floor((app.sizes.width < this.sizeSlider ? app.sizes.width : this.sizeSlider) / this.widthSlide);
            if (!this.cnt || app.device.isPhone) this.cnt = 1;

            if (this.cnt == 1 && !this.scope.hasClass("largeSlides")){
                this.scope.addClass("largeSlides")
            }

            this.navUpdate();
            this.firstSlide.addClass("current");
        },

        show: function(callback){

            if (this.active) return;

            this.scope.addClass("showSlides");

            if (_.isFunction(callback)){
                _.onEndTransition(this.firstSlide[0], function(){
                    callback();
                });
            }

            this.active = true;
        },

        hide: function(callback){
            var _this = this;

            if (!this.active) {
                if (_.isFunction(callback)){
                    callback();
                }
                return;
            }

            this.reset();

            this.scope.addClass("hideSlides");

            _.onEndTransition(this.slider.find(".slider__item:first")[0], function(){
    			_this.scope.removeClass("showSlides hideSlides");
                _this.active = false;
                if (_.isFunction(callback)) callback();
    		});
        },

        reset: function(){

            this.setTranslateValue(0);

            this.slider.removeClass('next prev')
            .find('.current, .previous').removeClass("current previous");

            this.slider.find(".slider__item:first").addClass("current");

            this.navUpdate();
        },

        navUpdate: function(){
            var l = this.slider.find(".slider__item").length,
                max = parseInt(Math.floor(this.sizeSlider / this.slider.find(".slider__item").width()));

            if (this.cnt > 1 && l < max + 1 || this.cnt == 1 && l == "1"){
                this.nav.next.addClass('slider__nav--hidden');
            }
            else {
                this.nav.next.removeClass('slider__nav--hidden');
            }
            this.nav.prev.addClass('slider__nav--hidden');
        },

    	nextSlides: function() {

    		var _this = this,
                actual = this.slider.children('.current'),
    			index = actual.index(),
    			following = actual.nextAll('.slider__item').length;

                if (this.cnt == 1){
                    index = following ? index + this.cnt : index;
                }
                else {
                    index = (following > (this.cnt + 1)) ? index + this.cnt : index + following - (this.cnt - 1);
                }

            var translate = index * (this.widthSlide + 15) + 'px';

    		if (this.cnt > 1) this.slider.addClass('next');
    		this.setTranslateValue(translate);

            if (app.device.isPhone){
                _this.updateSlider('next', actual, following);
            }
            else {
                _.onEndTransition(this.slider[0], function(){
        			_this.updateSlider('next', actual, following);
        		});
            }

            this.index = index;

    		//if( $('.no-csstransitions').length > 0 ) updateSlider('next', actual, following);
    	},

    	prevSlides: function() {
    		var _this = this,
                actual = this.slider.children('.previous'),
    			index = actual.index(),
                translate = index * (this.widthSlide + 15) + 'px';

            if (this.cnt > 1) this.slider.addClass('prev');
    		this.setTranslateValue(translate);

            if (app.device.isPhone){
                _this.updateSlider('prev', actual);
            }
            else {
                _.onEndTransition(this.slider[0], function(){
        			_this.updateSlider('prev', actual);
        		});
            }

            this.index = index;

    		//if( $('.no-csstransitions').length > 0 ) updateSlider('prev', actual);
    	},

    	updateSlider: function(direction, actual, numerFollowing) {
    		if (direction === 'next'){

    			this.slider.removeClass('next')
                .find('.previous')
                .removeClass('previous');

    			actual.removeClass('current');

                if (this.cnt == 1){
                    actual.addClass('previous')
                    .next('.slider__item')
                    .addClass('current');
                }
                else {
        			if (numerFollowing > (this.cnt + 1)) {
        				actual.addClass('previous')
                        .next('.slider__item')
                        .next('.slider__item')
                        .next('.slider__item')
                        .addClass('current');
        			}
                    else if (numerFollowing == (this.cnt + 1)) {
        				actual.next('.slider__item')
                        .next('.slider__item')
                        .addClass('current')
                        .prev('.slider__item')
                        .prev('.slider__item')
                        .addClass('previous');
        			}
                    else {
        				actual.next('.slider__item')
                        .addClass('current')
                        .end()
                        .addClass('previous');
        			}
                }

    		} else {

    			this.slider.removeClass('prev')
                .find('.current')
                .removeClass('current');

    			actual.removeClass('previous')
                .addClass('current');

                if (this.cnt == 1){
                    actual.prev('.slider__item')
                    .addClass('previous');
                }
                else {
        			if (actual.prevAll('.slider__item').length > (this.cnt - 1)) {
        				actual.prev('.slider__item')
                        .prev('.slider__item')
                        .prev('.slider__item')
                        .addClass('previous');
        			}
                    else {
        				(!this.slider.children('.slider__item').eq(0).hasClass('current')) && this.slider.children('.slider__item').eq(0).addClass('previous');
        			}
                }
    		}

    		this.updateNavigation();
    	},

    	updateNavigation: function() {
    		var current = this.slider.find('.slider__item.current');
    		(current.is(':first-child')) ? this.nav.prev.addClass('slider__nav--hidden') : this.nav.prev.removeClass('slider__nav--hidden');
    		(current.nextAll('.slider__item').length < this.cnt) ? this.nav.next.addClass('slider__nav--hidden') : this.nav.next.removeClass('slider__nav--hidden');
    	},

    	setTranslateValue: function(translate) {
    		this.slider.css({
    		    '-moz-transform': 'translate3d(-' + translate + ', 0, 0)',
    		    '-webkit-transform': 'translate3d(-' + translate + ', 0, 0)',
    			'-ms-transform': 'translate3d(-' + translate + ', 0, 0)',
    			'-o-transform': 'translate3d(-' + translate + ', 0, 0)',
    			'transform': 'translate3d(-' + translate + ', 0, 0)',
    		});
    	}
    };

})(app, $, app.$dom, app.events, app.utils);
