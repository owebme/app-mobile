'use strict';

app.define("Animation.Pages");

Animation.Pages = function($){
    this.DURATION = 500;
    this.EASING = 'cubic360'; // cubic-bezier(0.36,0.66,0.04,1)
    this.OFF_RIGHT = '99.5%';
    this.OFF_LEFT = '-33%';
    this.CENTER = '0%';
    this.OFF_OPACITY = 0.8;
    this.SLIDING = false;
    this.SWIPEHIDE = $defaults && $defaults.page.swipeHide || false;
    this.init($);
};

Animation.Pages.prototype = {
    init: function($){
        this.$page = {
            wrapper: $.root
        }
        this.$page.content = this.$page.wrapper.querySelector('ion-content');
        this.$page.navbar = this.$page.wrapper.querySelector('ion-navbar');

        if (!this.$page.navbar || !this.$page.content) return;

        this.$page.navbarBg = this.$page.navbar.querySelector('toolbar-background');
        this.$page.navbarTitle = this.$page.navbar.querySelector('ion-title');
        this.$page.navbarButtons = this.$page.navbar.querySelectorAll('button[bar-button]');
        this.$page.navbarBackText = this.$page.navbar.querySelector('back-button-text');
        return true;
    },
    entities: function(){
        return this.$page;
    },
    closure: function(page){
        this.$closure = page;
    },
    open: function($){
        if (!$.nav) return;

        var $opening = $.nav.entities();

        if ($opening.wrapper.getAttribute("hidden") === undefined) return;

        _.each($root.root.querySelectorAll('app-root > ion-nav > .ion-page:not([hidden])'), function(page){
            page.setAttribute("hidden", "");
        });

        var $opening = $.nav.entities();

        $opening.content.style[app.prefixed.transform] = "";
        $opening.navbarTitle.style[app.prefixed.transform] = "";
        $opening.navbarTitle.style.opacity = "1";
        $opening.navbarBg.style[app.prefixed.transform] = "";

        if ($opening.navbarButtons){
            _.each($opening.navbarButtons, function(button){
                if (button.getAttribute("back") !== undefined){
                    button.removeAttribute("show");
                }
                button.style.opacity = "1";
            });
            if ($opening.navbarBackText){
                $opening.navbarBackText.style[app.prefixed.transform] = "";
            }
        }
        $opening.wrapper.removeAttribute("hidden");
    },
    show: function($, callback){
        if (this.SLIDING) return;

        var self = this,
            $opening = $.nav.entities(),
            $closure = this.$page;

        if (this.$closure === $opening){
            this.hide(); return;
        }

        this.SLIDING = true;

        $.nav.closure($closure);

        $opening.content.style[app.prefixed.transform] = "translateX(" + self.OFF_RIGHT + ")";
        $opening.navbarTitle.style[app.prefixed.transform] = "translateX(" + self.OFF_RIGHT + ")";
        $opening.navbarTitle.style.opacity = "1";
        $opening.navbarBg.style[app.prefixed.transform] = "translateX(" + self.OFF_RIGHT + ")";

        if ($opening.navbarButtons){
            _.each($opening.navbarButtons, function(button){
                button.setAttribute("show", "");
                button.style.opacity = "0.01";
            });
            if ($opening.navbarBackText){
                $opening.navbarBackText.style[app.prefixed.transform] = "translateX(100px)";
            }
        }
        $opening.wrapper.style.zIndex = "1000";
        $opening.wrapper.removeAttribute("hidden");

        $afterlag.run(function(){
            anime.timeline({
                complete: function() {
                    $closure.wrapper.setAttribute("hidden", "");
                    $opening.wrapper.style.zIndex = "";
                    self.SLIDING = false;
                    if (_.isFunction(callback)) callback();
                }
            })
            .add({
                targets: $closure.content,
                translateX: [self.CENTER, self.OFF_LEFT],
                translateZ: 0,
                opacity: [1, self.OFF_OPACITY],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $closure.navbarButtons,
                opacity: [1, 0],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $closure.navbarTitle,
                translateX: [self.CENTER, self.OFF_LEFT],
                translateZ: 0,
                opacity: [1, 0],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.content,
                translateX: [self.OFF_RIGHT, self.CENTER],
                translateZ: 0,
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.navbarTitle,
                translateX: [self.OFF_RIGHT, self.CENTER],
                translateZ: 0,
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.navbarBg,
                translateX: [self.OFF_RIGHT, self.CENTER],
                translateZ: 0,
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.navbarButtons,
                opacity: [0.01, 1],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.navbarBackText,
                translateX: ["100px", "0px"],
                translateZ: 0,
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            });
        });

        if (self.SWIPEHIDE && window.jQuery){
            jQuery($opening.wrapper).one("swipeRight", function(){
                $.nav.hide();
            });
        }
    },
    hide: function($, callback){
        if (this.SLIDING) return;

        var self = this,
            $opening = $ || this.$closure,
            $closure = this.$page;

        if (!$opening) return;

        this.SLIDING = true;

        $opening.wrapper.removeAttribute("hidden");

        $afterlag.run(function(){
            anime.timeline({
                complete: function() {
                    $closure.wrapper.setAttribute("hidden", "");
                    self.SLIDING = false;
                    if (_.isFunction(callback)) callback();
                }
            })
            .add({
                targets: $closure.content,
                translateX: [self.CENTER, '100%'],
                translateZ: 0,
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $closure.navbarTitle,
                translateX: [self.CENTER, '100%'],
                translateZ: 0,
                opacity: [0.99, 0],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $closure.navbarBg,
                translateX: [self.CENTER, '100%'],
                translateZ: 0,
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $closure.navbarButtons,
                opacity: [0.99, 0],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $closure.navbarBackText,
                translateX: ["0px", "300px"],
                translateZ: 0,
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.content,
                translateX: [self.OFF_LEFT, self.CENTER],
                translateZ: 0,
                opacity: [self.OFF_OPACITY, 1],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.navbarTitle,
                translateX: [self.OFF_LEFT, self.CENTER],
                translateZ: 0,
                opacity: [0, 1],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.navbarButtons,
                opacity: [0.01, 1],
                easing: self.EASING,
                duration: self.DURATION,
                offset: 0
            })
        });

        if (self.SWIPEHIDE && window.jQuery){
            jQuery(self.$page.wrapper).off("swipeRight");
        }
    }
}
