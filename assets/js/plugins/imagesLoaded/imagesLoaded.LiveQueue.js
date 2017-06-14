(function(app, $, $dom, EV, _){

    app.define("plugins.imagesLoaded.LiveQueue");

    app.plugins.imagesLoaded.LiveQueue = function(i){
        this._queue = new app.plugins.imagesLoaded.Queue();
        this._maxProcesses = i || 1;
        this._availableSlots = this._maxProcesses;
        this._rafId = 0;
        this._isRunning = false;
        this._boundFunctions = {
            _run: this._run.bind(this),
            _releaseSlot: this._releaseSlot.bind(this)
        }
    };

    app.plugins.imagesLoaded.LiveQueue.prototype = {
        start: function() {
            if (this._isRunning) {
                _.caf(this._rafId)
            }
            this._rafId = _.raf(this._boundFunctions._run);
            this._isRunning = true
        },
        pause: function() {
            if (this._isRunning) {
                _.caf(this._rafId);
                this._rafId = 0
            }
            this._isRunning = false
        },
        stop: function() {
            this.pause();
            this.clear()
        },
        enqueue: function(i, j) {
            if (typeof i !== "function") {
                throw new Error("LiveQueue can only enqueue functions")
            }
            return this._queue.enqueue(i, j)
        },
        clear: function() {
            this._queue = new app.plugins.imagesLoaded.Queue()
        },
        destroy: function() {
            this.pause();
            this._isRunning = false;
            this._queue = null;
            this._boundFunctions = null
        },
        count: function() {
            return this._queue.count() + this.pending()
        },
        pending: function() {
            return this._maxProcesses - this._availableSlots
        },
        isEmpty: function() {
            return this.count() === 0
        },
        _run: function() {
            if (!this._isRunning) {
                return
            }
            this._rafId = _.raf(this._boundFunctions._run);
            if (this._queue.isEmpty() || this._availableSlots == 0) {
                return
            }
            var j = this._queue.dequeue();
            var i = j.data();
            if (this._isPromise(i)) {
                this._retainSlot();
                i.then(this._boundFunctions._releaseSlot, this._boundFunctions._releaseSlot)
            }
            this._stopRunningIfDone()
        },
        _retainSlot: function() {
            this._availableSlots--
        },
        _releaseSlot: function() {
            this._availableSlots++;
            this._stopRunningIfDone()
        },
        _stopRunningIfDone: function() {
            if (this._rafId != 0 && this._queue.count() === 0 && this._availableSlots == this._maxProcesses) {
                _.caf(this._rafId);
                this._rafId = 0
            }
        },
        _isPromise: function(i) {
            return !!(i && typeof i.then === "function")
        }
    };

})(app, $, app.$dom, app.events, app.utils);
