'use strict';

app.define("Animation.Popovers");

Animation.Popovers = {
    POPOVER_IOS_BODY_PADDING: 2,
    POPOVER_MD_BODY_PADDING: 12,
    backdrop: {
        opacity: {
            ios: 0.08,
            md: 0,
            wp: 0
        }
    },
    transitions: {
        ios: {
            in: {
                easing: "ease",
                duration: 200
            },
            out: {
                easing: "ease",
                duration: 300
            }
        },
        md: {
            in: {
                easing: "cubic360",
                duration: 300
            },
            out: {
                easing: "ease",
                duration: 300
            }
        },
        wp: {
            in: {
                easing: "cubic360",
                duration: 300
            },
            out: {
                easing: "ease",
                duration: 300
            }
        }
    },
    show: function(e, $, callback){
        var self = this;

        $.refs.wrapper.setAttribute("style", "");
        $.root.setAttribute("show", "");

        $afterlag.run(function(){

            self.setPosition(e, $);

            anime.timeline({
                complete: function() {
                    if (_.isFunction(callback)) callback();
                }
            })
            .add({
                targets: $.refs.backdrop,
                opacity: plt === "ios" ? [0.01, self.backdrop.opacity[plt]] : null,
                easing: self.transitions[plt].in.easing,
                duration: self.transitions[plt].in.duration,
                offset: 0
            })
            .add({
                targets: $.refs.wrapper,
                opacity: [0.01, 1],
                scale: plt !== "ios" ? [0.001, 1] : null,
                translateZ: 0,
                easing: self.transitions[plt].in.easing,
                duration: self.transitions[plt].in.duration,
                offset: 0
            })
            .add({
                targets: $.refs.arrow,
                opacity: [0.01, 1],
                easing: self.transitions[plt].in.easing,
                duration: self.transitions[plt].in.duration,
                offset: 0
            });
        });
    },
    hide: function($, callback){
        var self = this;

        anime.timeline({
            complete: function() {
                $.root.removeAttribute("show");
                if (_.isFunction(callback)) callback();
            }
        })
        .add({
            targets: $.refs.backdrop,
            opacity: plt === "ios" ? [self.backdrop.opacity[plt], 0] : null,
            easing: self.transitions[plt].out.easing,
            duration: self.transitions[plt].out.duration,
            offset: 0
        })
        .add({
            targets: $.refs.wrapper,
            opacity: [0.99, 0],
            easing: self.transitions[plt].out.easing,
            duration: self.transitions[plt].out.duration,
            offset: 0
        })
        .add({
            targets: $.refs.arrow,
            opacity: [0.99, 0],
            easing: self.transitions[plt].out.easing,
            duration: self.transitions[plt].out.duration,
            offset: 0
        });
    },
    setPosition: function (e, $) {
        var self = this;
        $.root.className = "";
        var PADDING = plt === "ios" ? self.POPOVER_IOS_BODY_PADDING : self.POPOVER_MD_BODY_PADDING;
        var originY = 'top';
        var originX = 'left';
        var popoverWrapperEle = $.refs.wrapper;
        var popoverEle = $.refs.content;
        var popoverDim = popoverEle.getBoundingClientRect();
        var popoverWidth = popoverDim.width;
        var popoverHeight = popoverDim.height;
        // Window body width and height
        var bodyWidth = app.sizes.width;
        var bodyHeight = app.sizes.height;
        // If ev was passed, use that for target element
        var targetDim = e && e.target && e.target.getBoundingClientRect();
        var targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
        var targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2);
        var targetWidth = targetDim && targetDim.width || 0;
        var targetHeight = targetDim && targetDim.height || 0;
        // The arrow that shows above the popover on iOS
        var arrowEle = $.refs.arrow;
        var arrowDim = arrowEle.getBoundingClientRect();
        var arrowWidth = arrowDim.width;
        var arrowHeight = arrowDim.height;
        var arrowCSS = {
            top: targetTop + targetHeight,
            left: targetLeft + (targetWidth / 2) - (arrowWidth / 2)
        };
        var popoverCSS = {
            top: targetTop + targetHeight + (arrowHeight - 1),
            left: targetLeft + (targetWidth / 2) - (popoverWidth / 2)
        };
        // If the popover left is less than the padding it is off screen
        // to the left so adjust it, else if the width of the popover
        // exceeds the body width it is off screen to the right so adjust

        if (popoverCSS.left < PADDING) {
            popoverCSS.left = PADDING;
        }
        else if (popoverWidth + PADDING + popoverCSS.left > bodyWidth) {
            popoverCSS.left = bodyWidth - popoverWidth - PADDING;
            originX = 'right';
        }
        // If the popover when popped down stretches past bottom of screen,
        // make it pop up if there's room above
        if (targetTop + targetHeight + popoverHeight > bodyHeight && targetTop - popoverHeight > 0) {
            popoverCSS.top = targetTop - popoverHeight - (arrowHeight - 1);
            $.root.className = $.root.className + ' popover-bottom';
            originY = 'bottom';
            arrowCSS.top = popoverCSS.top + popoverHeight - 1;
            // If there isn't room for it to pop up above the target cut it off
        }
        else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
            popoverWrapperEle.style.bottom = PADDING + '%';
        }
        arrowEle.style.top = arrowCSS.top + 'px';
        arrowEle.style.left = arrowCSS.left + 'px';
        popoverWrapperEle.style.top = popoverCSS.top + 'px';
        popoverWrapperEle.style.left = popoverCSS.left + 'px';
        ((popoverWrapperEle.style))[app.prefixed["transform-origin"]] = originY + ' ' + originX;
        originY + ' ' + originX;
        // Since the transition starts before styling is done we
        // want to wait for the styles to apply before showing the wrapper
    }
}
