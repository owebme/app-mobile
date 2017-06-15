'use strict';

app.define("Animation.ActionSheet");

Animation.ActionSheet = {
    backdrop: {
        opacity: {
            ios: 0.4,
            md: 0.26,
            wp: 0.16
        },
        duration: {
            in: {
                ios: 400,
                md: 400,
                wp: 400
            },
            out: {
                ios: 300,
                md: 450,
                wp: 450
            }
        }
    },
    show: function($, callback){
        $.root.setAttribute("show", "");

        anime.timeline({
            complete: function() {
                if (_.isFunction(callback)) callback();
            }
        }).add({
            targets: $.refs.backdrop,
            opacity: [0.01, this.backdrop.opacity[plt]],
            easing: 'cubic360',
            duration: this.backdrop.duration.in[plt],
            offset: 0
        })
        .add({
            targets: $.refs.wrapper,
            translateY: ["100%", "0%"],
            translateZ: 0,
            easing: 'cubic360',
            duration: this.backdrop.duration.out[plt],
            offset: 0
        });
    },
    hide: function($, callback){
        anime.timeline({
            complete: function() {
                $.root.removeAttribute("show");
                if (_.isFunction(callback)) callback();
            }
        })
        .add({
            targets: $.refs.backdrop,
            opacity: [this.backdrop.opacity[plt], 0],
            duration: this.backdrop.duration.in[plt],
            easing: 'cubic360',
            offset: 0
        })
        .add({
            targets: $.refs.wrapper,
            translateY: ["0%", "100%"],
            translateZ: 0,
            duration: this.backdrop.duration.out[plt],
            easing: 'cubic360',
            offset: 0
        });
    }
}
