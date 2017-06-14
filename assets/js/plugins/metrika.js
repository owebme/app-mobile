(function(app, $, $dom, EV, _){

    app.define("plugins.metrika");

    app.plugins.metrika = function(options){
        if (!options){
            this.get = function(){};
            this.set = function(){};
            return;
        }
        this.state = options.data;
        this.previousState = options.previousData;
        this.visits = options.visits;
        this.device = options.device;
        this.readOnly = options.readOnly;
        this.key = options.key;
        this.report = options.report;
        this.init();
    };

    app.plugins.metrika.prototype = {

        init: function(){
            if (this.active) return;
            if (!this.key) console.log("Not available key attribute");
            if (!this.state) console.log("Not available data attribute");
            if (!this.key || !this.state) return;

            var _this = this,
                state = this.state,
                key = this.key,
                store = Store.get(key),
                prevDate = this.previousState ? this.previousState.date : null,
                ver = store && store.ver || this.previousState && this.previousState.ver;

            if (!this.readOnly){
                if (ver && ver != state.ver){
                    Store.set(key, {
                        'ver': state.ver
                    });
                }
                else {
                    if (store && !prevDate){
                        _.deepExtend(state, store);
                    }
                    else if (prevDate){
                        if (window.moment && store && store.date){
                            store = moment(prevDate).diff(moment(store.date)) > 0 ? this.previousState : store;
                        }
                        else {
                            store = this.previousState;
                        }
                        _.deepExtend(state, store);
                    }
                }
            }

            if (this.visits) state.visits = this.visits;
            if (this.device) state.device = app.device && app.device.get ? app.device.get() : null;
            this.state = new Baobab(state, { autoCommit: true });

            if (!this.readOnly){
                this.state.on("write", function(e){
                    Store.set(key, _this.state.get());
                });
                Store.set(key, this.state.get());
            }

            if (this.report) this.logger();

            this.active = true;
        },

        set: function(path, value, options){
            if (!path || !this.active || this.readOnly) return;
            var options = options || {};

            if (options.action == "inc") {
                var val = this.state.get(path.split(".")) || 0;
                this.state.select(path.split(".")).set(val + value);
            }
            else if (options.action == "dec") {
                var val = this.state.get(path.split(".")) || 0;
                this.state.select(path.split(".")).set(val - value);
            }
            else {
                this.state.select(path.split(".")).set(value);
            }
            if (options.force){
                this.logger.request();
            }
        },

        get: function(path){
            if (!path || !this.active) return;
            return this.state.get(path.split("."));
        },

        logger: function(){
            var _this = this,
                method = this.report.method,
                interval = this.report.interval;

            this.logger.request = function(){
                var state = _this.state.get(),
                    stateJSON = JSON.stringify(state);

                if (_this.lastState != stateJSON){
                    _this.lastState = stateJSON;

                    app.request(method, state, {
                        loader: false,
                        notify: false
                    });
                }
            }

            if (method && interval){

                this.lastState = JSON.stringify(this.state.get());

                setInterval(function(){
                    _this.logger.request();

                }, interval * 1000);
            }
        }
    };

})(app, $, app.$dom, app.events, app.utils);
