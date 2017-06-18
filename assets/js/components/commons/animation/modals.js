'use strict';

app.define("Animation.Modals");

Animation.Modals = function($){
    this.DURATION = 500;
    this.EASING_OPEN = 'cubic4001';
    this.EASING_CLOSE = 'cubic4021';
    this.BACKDROP_OPACITY = 0.4;
    this.SLIDING = false;
    this.init($);
};

Animation.Modals.prototype = {
    init: function($){
        this.$modal = {
            wrapper: $.root
        }
        this.$modal.backdrop = this.$modal.wrapper.querySelector('ion-backdrop');
        this.$modal.container = this.$modal.wrapper.querySelector('modal-wrapper');

        if (!this.$modal.container) return;

        return true;
    },
    show: function($, callback){
        if (this.SLIDING) return;

        this.SLIDING = true;

        var self = this,
            $opening = this.$modal;

        $opening.wrapper.setAttribute("show", "");

        $afterlag.run(function(){
            anime.timeline({
                complete: function() {
                    $root.$pages.attr("hidden", "");
                    self.SLIDING = false;
                    if (_.isFunction(callback)) callback();
                }
            })
            .add({
                targets: $opening.container,
                translateY: ["100%", "0%"],
                translateZ: 0,
                easing: self.EASING_OPEN,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $opening.backdrop,
                opacity: [0.01, 0.4],
                easing: self.EASING_OPEN,
                duration: self.DURATION,
                offset: 0
            });
        });
    },
    hide: function($, callback){
        if (this.SLIDING) return;

        this.SLIDING = true;

        var self = this,
            $closure = this.$modal;

        $root.$pages.removeAttr("hidden");

        $afterlag.run(function(){
            anime.timeline({
                complete: function() {
                    $closure.wrapper.removeAttribute("show");
                    self.SLIDING = false;
                    if (_.isFunction(callback)) callback();
                }
            })
            .add({
                targets: $closure.container,
                translateY: ['0%', '100%'],
                translateZ: 0,
                easing: self.EASING_CLOSE,
                duration: self.DURATION,
                offset: 0
            })
            .add({
                targets: $closure.backdrop,
                opacity: [0.4, 0],
                easing: self.EASING_CLOSE,
                duration: self.DURATION,
                offset: 0
            });
        });
    }
}
