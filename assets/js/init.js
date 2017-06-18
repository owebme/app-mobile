'use strict';

(function(){

    window.plt = "ios";

    window.$Pages = new app.plugins.define("$Pages");

    riot.compile(function(){
        riot.mount("*");

        (function initPages(tags){
            _.each(tags, function(tag){
                if (tag.root){
                    //console.log(tag.root.nodeName);
                    if (tag.root.getAttribute("class")){
                        if (tag.root.getAttribute("class").match(/ion-page/)){
                            tag.nav = new Animation.Pages(tag);
                            if (tag.nav){
                                tag.role = "page";
                                tag.on("show", function(page){
                                    tag.nav.show(page);
                                });
                                tag.on("hide", function(){
                                    tag.nav.hide();
                                });
                                tag.on("onBack", function(){
                                    tag.nav.hide();
                                });
                                tag.on("onClose", function(){
                                    if (tag.role === "modal"){
                                        tag.nav.hide();
                                    }
                                    else {
                                        tag.parent.trigger("onClose");
                                    }
                                });
                            }
                        }
                        else if (tag.root.getAttribute("class").match(/ion-modal/)){
                            tag.nav = new Animation.Modals(tag);
                            if (tag.nav){
                                tag.role = "modal";
                                tag.on("show", function(){
                                    tag.nav.show();
                                });
                                tag.on("hide", function(){
                                    tag.nav.hide();
                                });
                                tag.on("onClose", function(){
                                    tag.nav.hide();
                                });
                            }
                        }
                    }
                    if (tag.root.nodeName.toLowerCase() === "ion-menu"){
                        tag.role = "menu";
                        tag.pages = new Animation.Pages(tag);
                        tag.nav = new Animation.Menu(tag);
                        tag.on("show", function(){
                            tag.nav.show();
                        });
                        tag.on("hide", function(){
                            tag.nav.hide();
                        });
                    }
                }
                if (tag.tags){
                    initPages(tag.tags);
                }
            });
        })(riot.vdom ? riot.vdom : riot.util.vdom);
    });

})();
