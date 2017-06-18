'use strict';

app.define("Animation.Loader");

Animation.Loader = {
    backdrop: {
        opacity: {
            ios: 0.3,
            md: 0.5,
            wp: 0.16
        },
        scale: {
            in: {
                ios: 1.1,
                md: 1.1,
                wp: 1.3
            },
            out: {
                ios: 0.9,
                md: 0.9,
                wp: 1.3
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
            easing: plt === "wp" ? 'cubic005' : 'easeInOutEase',
            duration: 200,
            offset: 0
        })
        .add({
            targets: $.refs.wrapper,
            opacity: [0.01, 1],
            scale: [this.backdrop.scale.in[plt], 1],
            translateZ: 0,
            easing: plt === "wp" ? 'cubic005' : 'easeInOutEase',
            duration: 200,
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
            duration: plt === "wp" ? 150 : 200,
            easing: plt === "wp" ? 'easeOutEase' : 'easeInOutEase',
            offset: 0
        })
        .add({
            targets: $.refs.wrapper,
            opacity: [0.99, 0],
            scale: [1, this.backdrop.scale.out[plt]],
            translateZ: 0,
            duration: plt === "wp" ? 150 : 200,
            easing: plt === "wp" ? 'easeOutEase' : 'easeInOutEase',
            offset: 0
        });
    }
}
