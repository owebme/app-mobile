'use strict';

app.define("Animation.Menu");

Animation.Menu = function($){
    this.init($);
};

Animation.Menu.prototype = {

    init: function($){
        this.$wrapper = $$($.root);
        this.$backdrop = this.$wrapper.find("ion-backdrop");
    },

    show: function(){
        var self = this;

        this.$wrapper.attr("open", true);

        setTimeout(function(){
            if (plt == "ios"){
                $root.$pages.one("click swipeLeft", function(){
                    self.hide();
                });
            }
            else {
                self.$backdrop.one("click", function(){
                    self.hide();
                });
                self.$wrapper.one("swipeLeft", function(){
                    self.hide();
                });
            }
        }, 20);
    },

    hide: function(){
        if (plt == "ios"){
            $root.$pages.off("click swipeLeft");
        }
        else {
            this.$backdrop.off("click");
            this.$wrapper.off("swipeLeft");
        }
        this.$wrapper.removeAttr("open");
    }
};
