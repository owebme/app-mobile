'use strict';

app.define("Animation.ItemSliding");

Animation.ItemSliding = function(list){
    this.DURATION = 200;
    this.EASING = 'ease-out';
    this.$list = $(list);
    this.item = "ion-item";
    this.itemSliding = "ion-item-sliding";
    this.itemOptions = "ion-item-options";
    this.touchStartEvent = app.device.isMobile ? "touchstart" : "mousedown";
    this.touchStopEvent = app.device.isMobile ? "touchend" : "mouseup";
    this.touchMoveEvent = app.device.isMobile ? "touchmove" : "mousemove";
    this.init();
};

Animation.ItemSliding.prototype = {

    init: function() {
        var self = this;

        self.$list.on("swipeLeft", self.itemSliding, function(e){
            self.swipeLeft(e.currentTarget, e.currentTarget.querySelector(self.item));

        });
        self.$list.on("swipeRight", self.itemSliding, function(e){
            self.swipeRight(e.currentTarget, e.currentTarget.querySelector(self.item));
        });
    },

    swipeLeft: function(target, item){
        var self = this;

        target.classList.add("active-slide", "active-options-right", "active-swipe-right");

        var sliding = target.querySelector(this.itemOptions).offsetWidth;

        item.style[app.prefixed.transition] = 'transform ' + self.DURATION + 'ms ' + self.EASING;
        item.style[app.prefixed.transform] = 'translateX(-' + sliding + 'px) translateZ(0)';

        app.utils.onEndTransition(item, function(){
            item.style[app.prefixed.transition] = "none";
        });
    },
    swipeRight: function(target, item){
        var self = this,
            sliding = target.querySelector(this.itemOptions).offsetWidth;

        item.style[app.prefixed.transition] = 'transform ' + self.DURATION + 'ms ' + self.EASING;
        item.style[app.prefixed.transform] = 'translateX(0) translateZ(0)';

        app.utils.onEndTransition(item, function(){
            target.classList.remove("active-slide", "active-options-right", "active-swipe-right");
            item.style[app.prefixed.transition] = "none";
        });
    }
};
