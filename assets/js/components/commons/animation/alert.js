'use strict';

app.define("Animation.alert");

Animation.alert = {
    backdrop: {
        opacity: {
            ios: 0.3,
            md: 0.5,
            wp: 0.5
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
            opacity: [ { value: 0.01 }, { value: Animation.alert.backdrop.opacity[plt] } ],
            easing: 'easeInOutEase',
            duration: 400,
            offset: 0
        })
        .add({
            targets: $.refs.wrapper,
            opacity: [ { value: 0.01 }, { value: 1 } ],
            scale: [ { value: Animation.alert.backdrop.scale.in[plt] }, { value: 1 } ],
            easing: 'easeInOutEase',
            duration: 400,
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
            opacity: [ { value: Animation.alert.backdrop.opacity[plt] }, { value: 0 } ],
            duration: 400,
            easing: 'easeInOutEase',
            offset: 0
        })
        .add({
            targets: $.refs.wrapper,
            opacity: [ { value: 0.99 }, { value: 0 } ],
            scale: [ { value: 1 }, { value: Animation.alert.backdrop.scale.out[plt] } ],
            duration: 400,
            easing: 'easeInOutEase',
            offset: 0
        });
    }
}
