(function(app, $, $dom, EV, _){

    app.define("plugins.imagesLoaded.Queue");

    app.plugins.imagesLoaded.Queue = function(){
        this.PRIORITY_LOW = 10;
        this.PRIORITY_DEFAULT = 5;
        this.PRIORITY_HIGH = 1;
        this._items = [];
    };

    app.plugins.imagesLoaded.Queue.prototype = {
        enqueue: function(i, h) {
            if (h === undefined) {
                h = this.PRIORITY_DEFAULT
            }
            return this.enqueueQueueItem(new app.plugins.imagesLoaded.QueueItem(i, h))
        },
        enqueueQueueItem: function(h) {
            this._items.push(h);
            return h
        },
        dequeue: function() {
            this._heapSort();
            var i = this._items.length - 1;
            var h = this._items[0];
            this._items[0] = this._items[i];
            this._items.pop();
            return h
        },
        peek: function() {
            if (this.count() == 0) {
                return null
            }
            this._heapSort();
            return this._items[0]
        },
        isEmpty: function() {
            return this._items.length === 0
        },
        count: function() {
            return this._items.length
        },
        toString: function() {
            var j = ["Queue total items: " + this.count() + "\n"];
            for (var h = 0; h < this.count(); ++h) {
                j.push(this._items[h].toString() + "\n")
            }
            return j.join("")
        },
        _heapSort: function() {
            var h = 0;
            for (var m = this._items.length - 1; m >= 0; m--) {
                var n = m;
                while (n > 0) {
                    h++;
                    var j = Math.floor((n - 1) / 2);
                    if (this._items[n].compareTo(this._items[j]) >= 0) {
                        break
                    }
                    var l = this._items[n];
                    this._items[n] = this._items[j];
                    this._items[j] = l;
                    n = j
                }
            }
        }
    };

})(app, $, app.$dom, app.events, app.utils);
