/**
 * Adopted from FastDom
 * https://github.com/wilsonpage/fastdom
 * MIT License
 */
import { Injectable } from '@angular/core';
import { Platform } from './platform';
import { removeArrayItem } from '../util/util';
/**
 * @hidden
 */
var DomDebouncer = (function () {
    /**
     * @param {?} dom
     */
    function DomDebouncer(dom) {
        this.dom = dom;
        this.writeTask = null;
        this.readTask = null;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    DomDebouncer.prototype.read = function (fn) {
        var _this = this;
        if (this.readTask) {
            return;
        }
        return this.readTask = this.dom.read(function (t) {
            _this.readTask = null;
            fn(t);
        });
    };
    /**
     * @param {?} fn
     * @param {?=} ctx
     * @return {?}
     */
    DomDebouncer.prototype.write = function (fn, ctx) {
        var _this = this;
        if (this.writeTask) {
            return;
        }
        return this.writeTask = this.dom.write(function (t) {
            _this.writeTask = null;
            fn(t);
        });
    };
    /**
     * @return {?}
     */
    DomDebouncer.prototype.cancel = function () {
        var /** @type {?} */ writeTask = this.writeTask;
        writeTask && this.dom.cancel(writeTask);
        var /** @type {?} */ readTask = this.readTask;
        readTask && this.dom.cancel(readTask);
        this.readTask = this.writeTask = null;
    };
    return DomDebouncer;
}());
export { DomDebouncer };
function DomDebouncer_tsickle_Closure_declarations() {
    /** @type {?} */
    DomDebouncer.prototype.writeTask;
    /** @type {?} */
    DomDebouncer.prototype.readTask;
    /** @type {?} */
    DomDebouncer.prototype.dom;
}
/**
 * @hidden
 */
var DomController = (function () {
    /**
     * @param {?} plt
     */
    function DomController(plt) {
        this.plt = plt;
        this.r = [];
        this.w = [];
    }
    /**
     * @return {?}
     */
    DomController.prototype.debouncer = function () {
        return new DomDebouncer(this);
    };
    /**
     * @param {?} fn
     * @param {?=} timeout
     * @return {?}
     */
    DomController.prototype.read = function (fn, timeout) {
        var _this = this;
        if (timeout) {
            ((fn)).timeoutId = this.plt.timeout(function () {
                _this.r.push(fn);
                _this._queue();
            }, timeout);
        }
        else {
            this.r.push(fn);
            this._queue();
        }
        return fn;
    };
    /**
     * @param {?} fn
     * @param {?=} timeout
     * @return {?}
     */
    DomController.prototype.write = function (fn, timeout) {
        var _this = this;
        if (timeout) {
            ((fn)).timeoutId = this.plt.timeout(function () {
                _this.w.push(fn);
                _this._queue();
            }, timeout);
        }
        else {
            this.w.push(fn);
            this._queue();
        }
        return fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    DomController.prototype.cancel = function (fn) {
        if (fn) {
            if (fn.timeoutId) {
                this.plt.cancelTimeout(fn.timeoutId);
            }
            removeArrayItem(this.r, fn) || removeArrayItem(this.w, fn);
        }
    };
    /**
     * @return {?}
     */
    DomController.prototype._queue = function () {
        var /** @type {?} */ self = this;
        if (!self.q) {
            self.q = true;
            self.plt.raf(function rafCallback(timeStamp) {
                self._flush(timeStamp);
            });
        }
    };
    /**
     * @param {?} timeStamp
     * @return {?}
     */
    DomController.prototype._flush = function (timeStamp) {
        var /** @type {?} */ err;
        try {
            dispatch(timeStamp, this.r, this.w);
        }
        catch (e) {
            err = e;
        }
        this.q = false;
        if (this.r.length || this.w.length) {
            this._queue();
        }
        if (err) {
            throw err;
        }
    };
    return DomController;
}());
export { DomController };
DomController.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DomController.ctorParameters = function () { return [
    { type: Platform, },
]; };
function DomController_tsickle_Closure_declarations() {
    /** @type {?} */
    DomController.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DomController.ctorParameters;
    /** @type {?} */
    DomController.prototype.r;
    /** @type {?} */
    DomController.prototype.w;
    /** @type {?} */
    DomController.prototype.q;
    /** @type {?} */
    DomController.prototype.plt;
}
/**
 * @param {?} timeStamp
 * @param {?} r
 * @param {?} w
 * @return {?}
 */
function dispatch(timeStamp, r, w) {
    var /** @type {?} */ fn;
    // ******** DOM READS ****************
    while (fn = r.shift()) {
        fn(timeStamp);
    }
    // ******** DOM WRITES ****************
    while (fn = w.shift()) {
        fn(timeStamp);
    }
}
//# sourceMappingURL=dom-controller.js.map