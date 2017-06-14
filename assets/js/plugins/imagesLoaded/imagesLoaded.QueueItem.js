(function(app, $, $dom, EV, _){

    app.define("plugins.imagesLoaded.QueueItem");

    app.plugins.imagesLoaded.QueueItem = function(i, h){
        var g = 0;
        this.priority = h;
        this.data = i;
        this.insertionOrder = g++;
    };

    app.plugins.imagesLoaded.QueueItem.prototype = {
        compareTo: function(h) {
            if (this.priority < h.priority) {
                return -1
            } else {
                if (this.priority > h.priority) {
                    return 1
                } else {
                    return (this.insertionOrder < h.insertionOrder) ? -1 : 1
                }
            }
        },
        toString: function() {
            return "QueueItem {priority:" + this.priority + ",\tdata:" + this.data + "\tinsertionOrder:" + this.insertionOrder + "}"
        }
    };

})(app, $, app.$dom, app.events, app.utils);
