'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Animation = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _util = require('../util/util');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * @hidden
 */
var Animation = exports.Animation = function () {
    /**
     * @param {?} plt
     * @param {?=} ele
     * @param {?=} opts
     */
    function Animation(plt, ele, opts) {
        _classCallCheck(this, Animation);

        this._dur = null;
        this._es = null;
        this._rvEs = null;
        this.hasChildren = false;
        this.isPlaying = false;
        this.hasCompleted = false;
        this.plt = plt;
        this.element(ele);
        this.opts = opts;
    }
    /**
     * @param {?} ele
     * @return {?}
     */

    _createClass(Animation, [{
        key: 'element',
        value: function element(ele) {
            if (ele) {
                if (typeof ele === 'string') {
                    ele = this.plt.doc().querySelectorAll(ele);
                    for (var /** @type {?} */i = 0; i < ele.length; i++) {
                        this._addEle(ele[i]);
                    }
                } else if (ele.length) {
                    for (var /** @type {?} */i = 0; i < ele.length; i++) {
                        this._addEle(ele[i]);
                    }
                } else {
                    this._addEle(ele);
                }
            }
            return this;
        }
        /**
         * NO DOM
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: '_addEle',
        value: function _addEle(ele) {
            if (ele.nativeElement) {
                ele = ele.nativeElement;
            }
            if (ele.nodeType === 1) {
                this._eL = (this._e = this._e || []).push(ele);
            }
        }
        /**
         * Add a child animation to this animation.
         * @param {?} childAnimation
         * @return {?}
         */

    }, {
        key: 'add',
        value: function add(childAnimation) {
            childAnimation.parent = this;
            this.hasChildren = true;
            this._cL = (this._c = this._c || []).push(childAnimation);
            return this;
        }
        /**
         * Get the duration of this animation. If this animation does
         * not have a duration, then it'll get the duration from its parent.
         * @param {?=} opts
         * @return {?}
         */

    }, {
        key: 'getDuration',
        value: function getDuration(opts) {
            if (opts && (0, _util.isDefined)(opts.duration)) {
                return opts.duration;
            } else if (this._dur !== null) {
                return this._dur;
            } else if (this.parent) {
                return this.parent.getDuration();
            }
            return 0;
        }
        /**
         * Returns if the animation is a root one.
         * @return {?}
         */

    }, {
        key: 'isRoot',
        value: function isRoot() {
            return !this.parent;
        }
        /**
         * Set the duration for this animation.
         * @param {?} milliseconds
         * @return {?}
         */

    }, {
        key: 'duration',
        value: function duration(milliseconds) {
            this._dur = milliseconds;
            return this;
        }
        /**
         * Get the easing of this animation. If this animation does
         * not have an easing, then it'll get the easing from its parent.
         * @return {?}
         */

    }, {
        key: 'getEasing',
        value: function getEasing() {
            if (this._rv && this._rvEs) {
                return this._rvEs;
            }
            return this._es !== null ? this._es : this.parent && this.parent.getEasing() || null;
        }
        /**
         * Set the easing for this animation.
         * @param {?} name
         * @return {?}
         */

    }, {
        key: 'easing',
        value: function easing(name) {
            this._es = name;
            return this;
        }
        /**
         * Set the easing for this reversed animation.
         * @param {?} name
         * @return {?}
         */

    }, {
        key: 'easingReverse',
        value: function easingReverse(name) {
            this._rvEs = name;
            return this;
        }
        /**
         * Add the "from" value for a specific property.
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */

    }, {
        key: 'from',
        value: function from(prop, val) {
            this._addProp('from', prop, val);
            return this;
        }
        /**
         * Add the "to" value for a specific property.
         * @param {?} prop
         * @param {?} val
         * @param {?=} clearProperyAfterTransition
         * @return {?}
         */

    }, {
        key: 'to',
        value: function to(prop, val, clearProperyAfterTransition) {
            var /** @type {?} */fx = this._addProp('to', prop, val);
            if (clearProperyAfterTransition) {
                // if this effect is a transform then clear the transform effect
                // otherwise just clear the actual property
                this.afterClearStyles([fx.trans ? this.plt.Css.transform : prop]);
            }
            return this;
        }
        /**
         * Shortcut to add both the "from" and "to" for the same property.
         * @param {?} prop
         * @param {?} fromVal
         * @param {?} toVal
         * @param {?=} clearProperyAfterTransition
         * @return {?}
         */

    }, {
        key: 'fromTo',
        value: function fromTo(prop, fromVal, toVal, clearProperyAfterTransition) {
            return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
        }
        /**
         * @hidden
         * NO DOM
         * @param {?} name
         * @return {?}
         */

    }, {
        key: '_getProp',
        value: function _getProp(name) {
            if (this._fx) {
                return this._fx.find(function (prop) {
                    return prop.name === name;
                });
            } else {
                this._fx = [];
            }
            return null;
        }
        /**
         * @param {?} state
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */

    }, {
        key: '_addProp',
        value: function _addProp(state, prop, val) {
            var /** @type {?} */fxProp = this._getProp(prop);
            if (!fxProp) {
                // first time we've see this EffectProperty
                var /** @type {?} */shouldTrans = ANIMATION_TRANSFORMS[prop] === 1;
                fxProp = {
                    name: prop,
                    trans: shouldTrans,
                    // add the will-change property for transforms or opacity
                    wc: shouldTrans ? this.plt.Css.transform : prop
                };
                this._fx.push(fxProp);
            }
            // add from/to EffectState to the EffectProperty
            var /** @type {?} */fxState = {
                val: val,
                num: null,
                unit: ''
            };
            fxProp[state] = fxState;
            if (typeof val === 'string' && val.indexOf(' ') < 0) {
                var /** @type {?} */r = val.match(ANIMATION_CSS_VALUE_REGEX);
                var /** @type {?} */num = parseFloat(r[1]);
                if (!isNaN(num)) {
                    fxState.num = num;
                }
                fxState.unit = r[0] !== r[2] ? r[2] : '';
            } else if (typeof val === 'number') {
                fxState.num = val;
            }
            return fxProp;
        }
        /**
         * Add CSS class to this animation's elements
         * before the animation begins.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'beforeAddClass',
        value: function beforeAddClass(className) {
            (this._bfAdd = this._bfAdd || []).push(className);
            return this;
        }
        /**
         * Remove CSS class from this animation's elements
         * before the animation begins.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'beforeRemoveClass',
        value: function beforeRemoveClass(className) {
            (this._bfRm = this._bfRm || []).push(className);
            return this;
        }
        /**
         * Set CSS inline styles to this animation's elements
         * before the animation begins.
         * @param {?} styles
         * @return {?}
         */

    }, {
        key: 'beforeStyles',
        value: function beforeStyles(styles) {
            this._bfSty = styles;
            return this;
        }
        /**
         * Clear CSS inline styles from this animation's elements
         * before the animation begins.
         * @param {?} propertyNames
         * @return {?}
         */

    }, {
        key: 'beforeClearStyles',
        value: function beforeClearStyles(propertyNames) {
            this._bfSty = this._bfSty || {};
            for (var /** @type {?} */i = 0; i < propertyNames.length; i++) {
                this._bfSty[propertyNames[i]] = '';
            }
            return this;
        }
        /**
         * Add a function which contains DOM reads, which will run
         * before the animation begins.
         * @param {?} domReadFn
         * @return {?}
         */

    }, {
        key: 'beforeAddRead',
        value: function beforeAddRead(domReadFn) {
            (this._rdFn = this._rdFn || []).push(domReadFn);
            return this;
        }
        /**
         * Add a function which contains DOM writes, which will run
         * before the animation begins.
         * @param {?} domWriteFn
         * @return {?}
         */

    }, {
        key: 'beforeAddWrite',
        value: function beforeAddWrite(domWriteFn) {
            (this._wrFn = this._wrFn || []).push(domWriteFn);
            return this;
        }
        /**
         * Add CSS class to this animation's elements
         * after the animation finishes.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'afterAddClass',
        value: function afterAddClass(className) {
            (this._afAdd = this._afAdd || []).push(className);
            return this;
        }
        /**
         * Remove CSS class from this animation's elements
         * after the animation finishes.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'afterRemoveClass',
        value: function afterRemoveClass(className) {
            (this._afRm = this._afRm || []).push(className);
            return this;
        }
        /**
         * Set CSS inline styles to this animation's elements
         * after the animation finishes.
         * @param {?} styles
         * @return {?}
         */

    }, {
        key: 'afterStyles',
        value: function afterStyles(styles) {
            this._afSty = styles;
            return this;
        }
        /**
         * Clear CSS inline styles from this animation's elements
         * after the animation finishes.
         * @param {?} propertyNames
         * @return {?}
         */

    }, {
        key: 'afterClearStyles',
        value: function afterClearStyles(propertyNames) {
            this._afSty = this._afSty || {};
            for (var /** @type {?} */i = 0; i < propertyNames.length; i++) {
                this._afSty[propertyNames[i]] = '';
            }
            return this;
        }
        /**
         * Play the animation.
         * @param {?=} opts
         * @return {?}
         */

    }, {
        key: 'play',
        value: function play(opts) {
            var _this = this;

            // If the animation was already invalidated (it did finish), do nothing
            if (!this.plt) {
                return;
            }
            // this is the top level animation and is in full control
            // of when the async play() should actually kick off
            // if there is no duration then it'll set the TO property immediately
            // if there is a duration, then it'll stage all animations at the
            // FROM property and transition duration, wait a few frames, then
            // kick off the animation by setting the TO property for each animation
            this._isAsync = this._hasDuration(opts);
            // ensure all past transition end events have been cleared
            this._clearAsync();
            // recursively kicks off the correct progress step for each child animation
            // ******** DOM WRITE ****************
            this._playInit(opts);
            // doubling up RAFs since this animation was probably triggered
            // from an input event, and just having one RAF would have this code
            // run within the same frame as the triggering input event, and the
            // input event probably already did way too much work for one frame
            this.plt.raf(function () {
                _this.plt.raf(_this._playDomInspect.bind(_this, opts));
            });
        }
        /**
         * @return {?}
         */

    }, {
        key: 'syncPlay',
        value: function syncPlay() {
            // If the animation was already invalidated (it did finish), do nothing
            if (!this.plt) {
                return;
            }
            var /** @type {?} */opts = { duration: 0 };
            this._isAsync = false;
            this._clearAsync();
            this._playInit(opts);
            this._playDomInspect(opts);
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_playInit',
        value: function _playInit(opts) {
            // always default that an animation does not tween
            // a tween requires that an Animation class has an element
            // and that it has at least one FROM/TO effect
            // and that the FROM/TO effect can tween numeric values
            this._twn = false;
            this.isPlaying = true;
            this.hasCompleted = false;
            this._hasDur = this.getDuration(opts) > ANIMATION_DURATION_MIN;
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playInit(opts);
            }
            if (this._hasDur) {
                // if there is a duration then we want to start at step 0
                // ******** DOM WRITE ****************
                this._progress(0);
                // add the will-change properties
                // ******** DOM WRITE ****************
                this._willChg(true);
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * ROOT ANIMATION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_playDomInspect',
        value: function _playDomInspect(opts) {
            // fire off all the "before" function that have DOM READS in them
            // elements will be in the DOM, however visibily hidden
            // so we can read their dimensions if need be
            // ******** DOM READ ****************
            // ******** DOM WRITE ****************
            this._beforeAnimation();
            // for the root animation only
            // set the async TRANSITION END event
            // and run onFinishes when the transition ends
            var /** @type {?} */dur = this.getDuration(opts);
            if (this._isAsync) {
                this._asyncEnd(dur, true);
            }
            // ******** DOM WRITE ****************
            this._playProgress(opts);
            if (this._isAsync && this.plt) {
                // this animation has a duration so we need another RAF
                // for the CSS TRANSITION properties to kick in
                this.plt.raf(this._playToStep.bind(this, 1));
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_playProgress',
        value: function _playProgress(opts) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playProgress(opts);
            }
            if (this._hasDur) {
                // set the CSS TRANSITION duration/easing
                // ******** DOM WRITE ****************
                this._setTrans(this.getDuration(opts), false);
            } else {
                // this animation does not have a duration, so it should not animate
                // just go straight to the TO properties and call it done
                // ******** DOM WRITE ****************
                this._progress(1);
                // since there was no animation, immediately run the after
                // ******** DOM WRITE ****************
                this._setAfterStyles();
                // this animation has no duration, so it has finished
                // other animations could still be running
                this._didFinish(true);
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} stepValue
         * @return {?}
         */

    }, {
        key: '_playToStep',
        value: function _playToStep(stepValue) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playToStep(stepValue);
            }
            if (this._hasDur) {
                // browser had some time to render everything in place
                // and the transition duration/easing is set
                // now set the TO properties which will trigger the transition to begin
                // ******** DOM WRITE ****************
                this._progress(stepValue);
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * ROOT ANIMATION
         * @param {?} dur
         * @param {?} shouldComplete
         * @return {?}
         */

    }, {
        key: '_asyncEnd',
        value: function _asyncEnd(dur, shouldComplete) {
            void 0;
            void 0;
            void 0;
            var /** @type {?} */self = this;
            /**
             * @return {?}
             */
            function onTransitionEnd() {
                // congrats! a successful transition completed!
                // ensure transition end events and timeouts have been cleared
                self._clearAsync();
                // ******** DOM WRITE ****************
                self._playEnd();
                // transition finished
                self._didFinishAll(shouldComplete, true, false);
            }
            /**
             * @return {?}
             */
            function onTransitionFallback() {
                void 0;
                // oh noz! the transition end event didn't fire in time!
                // instead the fallback timer when first
                // if all goes well this fallback should never fire
                // clear the other async end events from firing
                self._tm = undefined;
                self._clearAsync();
                // set the after styles
                // ******** DOM WRITE ****************
                self._playEnd(shouldComplete ? 1 : 0);
                // transition finished
                self._didFinishAll(shouldComplete, true, false);
            }
            // set the TRANSITION END event on one of the transition elements
            self._unrgTrns = this.plt.transitionEnd(self._transEl(), onTransitionEnd, false);
            // set a fallback timeout if the transition end event never fires, or is too slow
            // transition end fallback: (animation duration + XXms)
            self._tm = self.plt.timeout(onTransitionFallback, dur + ANIMATION_TRANSITION_END_FALLBACK_PADDING_MS);
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?=} stepValue
         * @return {?}
         */

    }, {
        key: '_playEnd',
        value: function _playEnd(stepValue) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playEnd(stepValue);
            }
            if (this._hasDur) {
                if ((0, _util.isDefined)(stepValue)) {
                    // too late to have a smooth animation, just finish it
                    // ******** DOM WRITE ****************
                    this._setTrans(0, true);
                    // ensure the ending progress step gets rendered
                    // ******** DOM WRITE ****************
                    this._progress(stepValue);
                }
                // set the after styles
                // ******** DOM WRITE ****************
                this._setAfterStyles();
                // remove the will-change properties
                // ******** DOM WRITE ****************
                this._willChg(false);
            }
        }
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_hasDuration',
        value: function _hasDuration(opts) {
            if (this.getDuration(opts) > ANIMATION_DURATION_MIN) {
                return true;
            }
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                if (children[i]._hasDuration(opts)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_hasDomReads',
        value: function _hasDomReads() {
            if (this._rdFn && this._rdFn.length) {
                return true;
            }
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                if (children[i]._hasDomReads()) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Immediately stop at the end of the animation.
         * @param {?=} stepValue
         * @return {?}
         */

    }, {
        key: 'stop',
        value: function stop() {
            var stepValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            // ensure all past transition end events have been cleared
            this._clearAsync();
            this._hasDur = true;
            this._playEnd(stepValue);
        }
        /**
         * @hidden
         * NO DOM
         * NO RECURSION
         * @return {?}
         */

    }, {
        key: '_clearAsync',
        value: function _clearAsync() {
            this._unrgTrns && this._unrgTrns();
            this._tm && clearTimeout(this._tm);
            this._tm = this._unrgTrns = undefined;
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} stepValue
         * @return {?}
         */

    }, {
        key: '_progress',
        value: function _progress(stepValue) {
            // bread 'n butter
            var /** @type {?} */val = void 0;
            var /** @type {?} */effects = this._fx;
            var /** @type {?} */nuElements = this._eL;
            if (!effects || !nuElements) {
                return;
            }
            // flip the number if we're going in reverse
            if (this._rv) {
                stepValue = stepValue * -1 + 1;
            }
            var /** @type {?} */i, /** @type {?} */j;
            var /** @type {?} */finalTransform = '';
            var /** @type {?} */elements = this._e;
            for (i = 0; i < effects.length; i++) {
                var /** @type {?} */fx = effects[i];
                if (fx.from && fx.to) {
                    var /** @type {?} */fromNum = fx.from.num;
                    var /** @type {?} */toNum = fx.to.num;
                    var /** @type {?} */tweenEffect = fromNum !== toNum;
                    void 0;
                    if (tweenEffect) {
                        this._twn = true;
                    }
                    if (stepValue === 0) {
                        // FROM
                        val = fx.from.val;
                    } else if (stepValue === 1) {
                        // TO
                        val = fx.to.val;
                    } else if (tweenEffect) {
                        // EVERYTHING IN BETWEEN
                        var /** @type {?} */valNum = (toNum - fromNum) * stepValue + fromNum;
                        var /** @type {?} */unit = fx.to.unit;
                        if (unit === 'px') {
                            valNum = Math.round(valNum);
                        }
                        val = valNum + unit;
                    }
                    if (val !== null) {
                        var /** @type {?} */prop = fx.name;
                        if (fx.trans) {
                            finalTransform += prop + '(' + val + ') ';
                        } else {
                            for (j = 0; j < nuElements; j++) {
                                // ******** DOM WRITE ****************
                                elements[j].style[prop] = val;
                            }
                        }
                    }
                }
            }
            // place all transforms on the same property
            if (finalTransform.length) {
                if (!this._rv && stepValue !== 1 || this._rv && stepValue !== 0) {
                    finalTransform += 'translateZ(0px)';
                }
                var /** @type {?} */cssTransform = this.plt.Css.transform;
                for (i = 0; i < elements.length; i++) {
                    // ******** DOM WRITE ****************
                    elements[i].style[cssTransform] = finalTransform;
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} dur
         * @param {?} forcedLinearEasing
         * @return {?}
         */

    }, {
        key: '_setTrans',
        value: function _setTrans(dur, forcedLinearEasing) {
            // Transition is not enabled if there are not effects
            if (!this._fx) {
                return;
            }
            // set the TRANSITION properties inline on the element
            var /** @type {?} */elements = this._e;
            var /** @type {?} */easing = forcedLinearEasing ? 'linear' : this.getEasing();
            var /** @type {?} */durString = dur + 'ms';
            var /** @type {?} */Css = this.plt.Css;
            var /** @type {?} */cssTransform = Css.transition;
            var /** @type {?} */cssTransitionDuration = Css.transitionDuration;
            var /** @type {?} */cssTransitionTimingFn = Css.transitionTimingFn;
            var /** @type {?} */eleStyle = void 0;
            for (var /** @type {?} */i = 0; i < this._eL; i++) {
                eleStyle = elements[i].style;
                if (dur > 0) {
                    // ******** DOM WRITE ****************
                    eleStyle[cssTransform] = '';
                    eleStyle[cssTransitionDuration] = durString;
                    // each animation can have a different easing
                    if (easing) {
                        // ******** DOM WRITE ****************
                        eleStyle[cssTransitionTimingFn] = easing;
                    }
                } else {
                    eleStyle[cssTransform] = 'none';
                }
            }
        }
        /**
         * @hidden
         * DOM READ
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_beforeAnimation',
        value: function _beforeAnimation() {
            // fire off all the "before" function that have DOM READS in them
            // elements will be in the DOM, however visibily hidden
            // so we can read their dimensions if need be
            // ******** DOM READ ****************
            this._fireBeforeReadFunc();
            // ******** DOM READS ABOVE / DOM WRITES BELOW ****************
            // fire off all the "before" function that have DOM WRITES in them
            // ******** DOM WRITE ****************
            this._fireBeforeWriteFunc();
            // stage all of the before css classes and inline styles
            // ******** DOM WRITE ****************
            this._setBeforeStyles();
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_setBeforeStyles',
        value: function _setBeforeStyles() {
            var /** @type {?} */i = void 0,

            /** @type {?} */j = void 0;
            var /** @type {?} */children = this._c;
            for (i = 0; i < this._cL; i++) {
                children[i]._setBeforeStyles();
            }
            // before the animations have started
            // only set before styles if animation is not reversed
            if (this._rv) {
                return;
            }
            var /** @type {?} */addClasses = this._bfAdd;
            var /** @type {?} */removeClasses = this._bfRm;
            var /** @type {?} */ele = void 0;
            var /** @type {?} */eleClassList = void 0;
            var /** @type {?} */prop = void 0;
            for (i = 0; i < this._eL; i++) {
                ele = this._e[i];
                eleClassList = ele.classList;
                // css classes to add before the animation
                if (addClasses) {
                    for (j = 0; j < addClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        eleClassList.add(addClasses[j]);
                    }
                }
                // css classes to remove before the animation
                if (removeClasses) {
                    for (j = 0; j < removeClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        eleClassList.remove(removeClasses[j]);
                    }
                }
                // inline styles to add before the animation
                if (this._bfSty) {
                    for (prop in this._bfSty) {
                        // ******** DOM WRITE ****************
                        ele.style[prop] = this._bfSty[prop];
                    }
                }
            }
        }
        /**
         * @hidden
         * DOM READ
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_fireBeforeReadFunc',
        value: function _fireBeforeReadFunc() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM READ ****************
                children[i]._fireBeforeReadFunc();
            }
            var /** @type {?} */readFunctions = this._rdFn;
            if (readFunctions) {
                for (var /** @type {?} */i = 0; i < readFunctions.length; i++) {
                    // ******** DOM READ ****************
                    readFunctions[i]();
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_fireBeforeWriteFunc',
        value: function _fireBeforeWriteFunc() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._fireBeforeWriteFunc();
            }
            var /** @type {?} */writeFunctions = this._wrFn;
            if (this._wrFn) {
                for (var /** @type {?} */i = 0; i < writeFunctions.length; i++) {
                    // ******** DOM WRITE ****************
                    writeFunctions[i]();
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * @return {?}
         */

    }, {
        key: '_setAfterStyles',
        value: function _setAfterStyles() {
            var /** @type {?} */i = void 0,

            /** @type {?} */j = void 0;
            var /** @type {?} */ele = void 0;
            var /** @type {?} */eleClassList = void 0;
            var /** @type {?} */elements = this._e;
            for (i = 0; i < this._eL; i++) {
                ele = elements[i];
                eleClassList = ele.classList;
                // remove the transition duration/easing
                // ******** DOM WRITE ****************
                ele.style[this.plt.Css.transitionDuration] = ele.style[this.plt.Css.transitionTimingFn] = '';
                if (this._rv) {
                    // finished in reverse direction
                    // css classes that were added before the animation should be removed
                    if (this._bfAdd) {
                        for (j = 0; j < this._bfAdd.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.remove(this._bfAdd[j]);
                        }
                    }
                    // css classes that were removed before the animation should be added
                    if (this._bfRm) {
                        for (j = 0; j < this._bfRm.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.add(this._bfRm[j]);
                        }
                    }
                    // inline styles that were added before the animation should be removed
                    if (this._bfSty) {
                        for (var /** @type {?} */prop in this._bfSty) {
                            // ******** DOM WRITE ****************
                            ele.style[prop] = '';
                        }
                    }
                } else {
                    // finished in forward direction
                    // css classes to add after the animation
                    if (this._afAdd) {
                        for (j = 0; j < this._afAdd.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.add(this._afAdd[j]);
                        }
                    }
                    // css classes to remove after the animation
                    if (this._afRm) {
                        for (j = 0; j < this._afRm.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.remove(this._afRm[j]);
                        }
                    }
                    // inline styles to add after the animation
                    if (this._afSty) {
                        for (var /** @type {?} */prop in this._afSty) {
                            // ******** DOM WRITE ****************
                            ele.style[prop] = this._afSty[prop];
                        }
                    }
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} addWillChange
         * @return {?}
         */

    }, {
        key: '_willChg',
        value: function _willChg(addWillChange) {
            var /** @type {?} */wc = void 0;
            var /** @type {?} */effects = this._fx;
            var /** @type {?} */willChange = void 0;
            if (addWillChange && effects) {
                wc = [];
                for (var /** @type {?} */i = 0; i < effects.length; i++) {
                    var /** @type {?} */propWC = effects[i].wc;
                    if (propWC === 'webkitTransform') {
                        wc.push('transform', '-webkit-transform');
                    } else {
                        wc.push(propWC);
                    }
                }
                willChange = wc.join(',');
            } else {
                willChange = '';
            }
            for (var /** @type {?} */i = 0; i < this._eL; i++) {
                // ******** DOM WRITE ****************
                this._e[i].style.willChange = willChange;
            }
        }
        /**
         * Start the animation with a user controlled progress.
         * @return {?}
         */

    }, {
        key: 'progressStart',
        value: function progressStart() {
            // ensure all past transition end events have been cleared
            this._clearAsync();
            // ******** DOM READ/WRITE ****************
            this._beforeAnimation();
            // ******** DOM WRITE ****************
            this._progressStart();
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_progressStart',
        value: function _progressStart() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._progressStart();
            }
            // force no duration, linear easing
            // ******** DOM WRITE ****************
            this._setTrans(0, true);
            // ******** DOM WRITE ****************
            this._willChg(true);
        }
        /**
         * Set the progress step for this animation.
         * progressStep() is not debounced, so it should not be called faster than 60FPS.
         * @param {?} stepValue
         * @return {?}
         */

    }, {
        key: 'progressStep',
        value: function progressStep(stepValue) {
            // only update if the last update was more than 16ms ago
            stepValue = Math.min(1, Math.max(0, stepValue));
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i].progressStep(stepValue);
            }
            if (this._rv) {
                // if the animation is going in reverse then
                // flip the step value: 0 becomes 1, 1 becomes 0
                stepValue = stepValue * -1 + 1;
            }
            // ******** DOM WRITE ****************
            this._progress(stepValue);
        }
        /**
         * End the progress animation.
         * @param {?} shouldComplete
         * @param {?} currentStepValue
         * @param {?=} dur
         * @return {?}
         */

    }, {
        key: 'progressEnd',
        value: function progressEnd(shouldComplete, currentStepValue) {
            var dur = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

            void 0;
            if (this._rv) {
                // if the animation is going in reverse then
                // flip the step value: 0 becomes 1, 1 becomes 0
                currentStepValue = currentStepValue * -1 + 1;
            }
            var /** @type {?} */stepValue = shouldComplete ? 1 : 0;
            var /** @type {?} */diff = Math.abs(currentStepValue - stepValue);
            if (diff < 0.05) {
                dur = 0;
            } else if (dur < 0) {
                dur = this._dur;
            }
            this._isAsync = dur > 30;
            this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);
            if (this._isAsync) {
                // for the root animation only
                // set the async TRANSITION END event
                // and run onFinishes when the transition ends
                // ******** DOM WRITE ****************
                this._asyncEnd(dur, shouldComplete);
                // this animation has a duration so we need another RAF
                // for the CSS TRANSITION properties to kick in
                this.plt && this.plt.raf(this._playToStep.bind(this, stepValue));
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} shouldComplete
         * @param {?} stepValue
         * @param {?} dur
         * @param {?} isAsync
         * @return {?}
         */

    }, {
        key: '_progressEnd',
        value: function _progressEnd(shouldComplete, stepValue, dur, isAsync) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._progressEnd(shouldComplete, stepValue, dur, isAsync);
            }
            if (!isAsync) {
                // stop immediately
                // set all the animations to their final position
                // ******** DOM WRITE ****************
                this._progress(stepValue);
                this._willChg(false);
                this._setAfterStyles();
                this._didFinish(shouldComplete);
            } else {
                // animate it back to it's ending position
                this.isPlaying = true;
                this.hasCompleted = false;
                this._hasDur = true;
                // ******** DOM WRITE ****************
                this._willChg(true);
                this._setTrans(dur, false);
            }
        }
        /**
         * Add a callback to fire when the animation has finished.
         * @param {?} callback
         * @param {?=} onceTimeCallback
         * @param {?=} clearOnFinishCallacks
         * @return {?}
         */

    }, {
        key: 'onFinish',
        value: function onFinish(callback) {
            var onceTimeCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var clearOnFinishCallacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (clearOnFinishCallacks) {
                this._fFn = this._fOneFn = undefined;
            }
            if (onceTimeCallback) {
                this._fOneFn = this._fOneFn || [];
                this._fOneFn.push(callback);
            } else {
                this._fFn = this._fFn || [];
                this._fFn.push(callback);
            }
            return this;
        }
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @param {?} hasCompleted
         * @param {?} finishAsyncAnimations
         * @param {?} finishNoDurationAnimations
         * @return {?}
         */

    }, {
        key: '_didFinishAll',
        value: function _didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                children[i]._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
            }
            if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
                this._didFinish(hasCompleted);
            }
        }
        /**
         * @hidden
         * NO RECURSION
         * @param {?} hasCompleted
         * @return {?}
         */

    }, {
        key: '_didFinish',
        value: function _didFinish(hasCompleted) {
            this.isPlaying = false;
            this.hasCompleted = hasCompleted;
            if (this._fFn) {
                // run all finish callbacks
                for (var /** @type {?} */i = 0; i < this._fFn.length; i++) {
                    this._fFn[i](this);
                }
            }
            if (this._fOneFn) {
                // run all "onetime" finish callbacks
                for (var /** @type {?} */i = 0; i < this._fOneFn.length; i++) {
                    this._fOneFn[i](this);
                }
                this._fOneFn.length = 0;
            }
        }
        /**
         * Reverse the animation.
         * @param {?=} shouldReverse
         * @return {?}
         */

    }, {
        key: 'reverse',
        value: function reverse() {
            var shouldReverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                children[i].reverse(shouldReverse);
            }
            this._rv = shouldReverse;
            return this;
        }
        /**
         * Recursively destroy this animation and all child animations.
         * @return {?}
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                children[i].destroy();
            }
            this._clearAsync();
            this.parent = this.plt = this._e = this._rdFn = this._wrFn = null;
            if (this._c) {
                this._c.length = this._cL = 0;
            }
            if (this._fFn) {
                this._fFn.length = 0;
            }
            if (this._fOneFn) {
                this._fOneFn.length = 0;
            }
        }
        /**
         * @hidden
         * NO DOM
         * @return {?}
         */

    }, {
        key: '_transEl',
        value: function _transEl() {
            // get the lowest level element that has an Animation
            var /** @type {?} */targetEl;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                targetEl = this._c[i]._transEl();
                if (targetEl) {
                    return targetEl;
                }
            }
            return this._twn && this._hasDur && this._eL ? this._e[0] : null;
        }
    }]);

    return Animation;
}();

function Animation_tsickle_Closure_declarations() {
    /** @type {?} */
    Animation.prototype._c;
    /** @type {?} */
    Animation.prototype._cL;
    /** @type {?} */
    Animation.prototype._e;
    /** @type {?} */
    Animation.prototype._eL;
    /** @type {?} */
    Animation.prototype._fx;
    /** @type {?} */
    Animation.prototype._dur;
    /** @type {?} */
    Animation.prototype._es;
    /** @type {?} */
    Animation.prototype._rvEs;
    /** @type {?} */
    Animation.prototype._bfSty;
    /** @type {?} */
    Animation.prototype._bfAdd;
    /** @type {?} */
    Animation.prototype._bfRm;
    /** @type {?} */
    Animation.prototype._afSty;
    /** @type {?} */
    Animation.prototype._afAdd;
    /** @type {?} */
    Animation.prototype._afRm;
    /** @type {?} */
    Animation.prototype._rdFn;
    /** @type {?} */
    Animation.prototype._wrFn;
    /** @type {?} */
    Animation.prototype._fFn;
    /** @type {?} */
    Animation.prototype._fOneFn;
    /** @type {?} */
    Animation.prototype._rv;
    /** @type {?} */
    Animation.prototype._unrgTrns;
    /** @type {?} */
    Animation.prototype._tm;
    /** @type {?} */
    Animation.prototype._hasDur;
    /** @type {?} */
    Animation.prototype._isAsync;
    /** @type {?} */
    Animation.prototype._twn;
    /** @type {?} */
    Animation.prototype.plt;
    /** @type {?} */
    Animation.prototype.parent;
    /** @type {?} */
    Animation.prototype.opts;
    /** @type {?} */
    Animation.prototype.hasChildren;
    /** @type {?} */
    Animation.prototype.isPlaying;
    /** @type {?} */
    Animation.prototype.hasCompleted;
}
var /** @type {?} */ANIMATION_TRANSFORMS = {
    'translateX': 1,
    'translateY': 1,
    'translateZ': 1,
    'scale': 1,
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'rotate': 1,
    'rotateX': 1,
    'rotateY': 1,
    'rotateZ': 1,
    'skewX': 1,
    'skewY': 1,
    'perspective': 1
};
var /** @type {?} */ANIMATION_CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
var /** @type {?} */ANIMATION_DURATION_MIN = 32;
var /** @type {?} */ANIMATION_TRANSITION_END_FALLBACK_PADDING_MS = 400;
//# sourceMappingURL=animation.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomController = exports.DomDebouncer = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}(); /**
      * Adopted from FastDom
      * https://github.com/wilsonpage/fastdom
      * MIT License
      */

var _core = require('@angular/core');

var _platform = require('./platform');

var _util = require('../util/util');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * @hidden
 */
var DomDebouncer = exports.DomDebouncer = function () {
    /**
     * @param {?} dom
     */
    function DomDebouncer(dom) {
        _classCallCheck(this, DomDebouncer);

        this.dom = dom;
        this.writeTask = null;
        this.readTask = null;
    }
    /**
     * @param {?} fn
     * @return {?}
     */

    _createClass(DomDebouncer, [{
        key: 'read',
        value: function read(fn) {
            var _this = this;

            if (this.readTask) {
                return;
            }
            return this.readTask = this.dom.read(function (t) {
                _this.readTask = null;
                fn(t);
            });
        }
        /**
         * @param {?} fn
         * @param {?=} ctx
         * @return {?}
         */

    }, {
        key: 'write',
        value: function write(fn, ctx) {
            var _this2 = this;

            if (this.writeTask) {
                return;
            }
            return this.writeTask = this.dom.write(function (t) {
                _this2.writeTask = null;
                fn(t);
            });
        }
        /**
         * @return {?}
         */

    }, {
        key: 'cancel',
        value: function cancel() {
            var /** @type {?} */writeTask = this.writeTask;
            writeTask && this.dom.cancel(writeTask);
            var /** @type {?} */readTask = this.readTask;
            readTask && this.dom.cancel(readTask);
            this.readTask = this.writeTask = null;
        }
    }]);

    return DomDebouncer;
}();

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

var DomController = exports.DomController = function () {
    /**
     * @param {?} plt
     */
    function DomController(plt) {
        _classCallCheck(this, DomController);

        this.plt = plt;
        this.r = [];
        this.w = [];
    }
    /**
     * @return {?}
     */

    _createClass(DomController, [{
        key: 'debouncer',
        value: function debouncer() {
            return new DomDebouncer(this);
        }
        /**
         * @param {?} fn
         * @param {?=} timeout
         * @return {?}
         */

    }, {
        key: 'read',
        value: function read(fn, timeout) {
            var _this3 = this;

            if (timeout) {
                fn.timeoutId = this.plt.timeout(function () {
                    _this3.r.push(fn);
                    _this3._queue();
                }, timeout);
            } else {
                this.r.push(fn);
                this._queue();
            }
            return fn;
        }
        /**
         * @param {?} fn
         * @param {?=} timeout
         * @return {?}
         */

    }, {
        key: 'write',
        value: function write(fn, timeout) {
            var _this4 = this;

            if (timeout) {
                fn.timeoutId = this.plt.timeout(function () {
                    _this4.w.push(fn);
                    _this4._queue();
                }, timeout);
            } else {
                this.w.push(fn);
                this._queue();
            }
            return fn;
        }
        /**
         * @param {?} fn
         * @return {?}
         */

    }, {
        key: 'cancel',
        value: function cancel(fn) {
            if (fn) {
                if (fn.timeoutId) {
                    this.plt.cancelTimeout(fn.timeoutId);
                }
                (0, _util.removeArrayItem)(this.r, fn) || (0, _util.removeArrayItem)(this.w, fn);
            }
        }
        /**
         * @return {?}
         */

    }, {
        key: '_queue',
        value: function _queue() {
            var /** @type {?} */self = this;
            if (!self.q) {
                self.q = true;
                self.plt.raf(function rafCallback(timeStamp) {
                    self._flush(timeStamp);
                });
            }
        }
        /**
         * @param {?} timeStamp
         * @return {?}
         */

    }, {
        key: '_flush',
        value: function _flush(timeStamp) {
            var /** @type {?} */err = void 0;
            try {
                dispatch(timeStamp, this.r, this.w);
            } catch (e) {
                err = e;
            }
            this.q = false;
            if (this.r.length || this.w.length) {
                this._queue();
            }
            if (err) {
                throw err;
            }
        }
    }]);

    return DomController;
}();

DomController.decorators = [{ type: _core.Injectable }];
/**
 * @nocollapse
 */
DomController.ctorParameters = function () {
    return [{ type: _platform.Platform }];
};
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
    var /** @type {?} */fn = void 0;
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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCss = getCss;
exports.pointerCoord = pointerCoord;
exports.hasPointerMoved = hasPointerMoved;
exports.isTextInput = isTextInput;
exports.copyInputAttributes = copyInputAttributes;
/**
 * @param {?} docEle
 * @return {?}
 */
function getCss(docEle) {
    var /** @type {?} */css = {};
    // transform
    var /** @type {?} */i;
    var /** @type {?} */keys = ['webkitTransform', '-webkit-transform', 'webkit-transform', 'transform'];
    for (i = 0; i < keys.length; i++) {
        if (docEle.style[keys[i]] !== undefined) {
            css.transform = keys[i];
            break;
        }
    }
    // transition
    keys = ['webkitTransition', 'transition'];
    for (i = 0; i < keys.length; i++) {
        if (docEle.style[keys[i]] !== undefined) {
            css.transition = keys[i];
            break;
        }
    }
    // The only prefix we care about is webkit for transitions.
    var /** @type {?} */isWebkit = css.transition.indexOf('webkit') > -1;
    // transition duration
    css.transitionDuration = (isWebkit ? '-webkit-' : '') + 'transition-duration';
    // transition timing function
    css.transitionTimingFn = (isWebkit ? '-webkit-' : '') + 'transition-timing-function';
    // transition delay
    css.transitionDelay = (isWebkit ? '-webkit-' : '') + 'transition-delay';
    // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
    css.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
    // transform origin
    css.transformOrigin = (isWebkit ? '-webkit-' : '') + 'transform-origin';
    // animation delay
    css.animationDelay = isWebkit ? 'webkitAnimationDelay' : 'animationDelay';
    return css;
}
/**
 * @param {?} ev
 * @return {?}
 */
function pointerCoord(ev) {
    // get coordinates for either a mouse click
    // or a touch depending on the given event
    if (ev) {
        var /** @type {?} */changedTouches = ev.changedTouches;
        if (changedTouches && changedTouches.length > 0) {
            var /** @type {?} */touch = changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
        }
        var /** @type {?} */pageX = ev.pageX;
        if (pageX !== undefined) {
            return { x: pageX, y: ev.pageY };
        }
    }
    return { x: 0, y: 0 };
}
/**
 * @param {?} threshold
 * @param {?} startCoord
 * @param {?} endCoord
 * @return {?}
 */
function hasPointerMoved(threshold, startCoord, endCoord) {
    if (startCoord && endCoord) {
        var /** @type {?} */deltaX = startCoord.x - endCoord.x;
        var /** @type {?} */deltaY = startCoord.y - endCoord.y;
        var /** @type {?} */distance = deltaX * deltaX + deltaY * deltaY;
        return distance > threshold * threshold;
    }
    return false;
}
/**
 * @param {?} ele
 * @return {?}
 */
function isTextInput(ele) {
    return !!ele && (ele.tagName === 'TEXTAREA' || ele.contentEditable === 'true' || ele.tagName === 'INPUT' && !NON_TEXT_INPUT_REGEX.test(ele.type));
}
var /** @type {?} */NON_TEXT_INPUT_REGEX = exports.NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;
var /** @type {?} */skipInputAttrsReg = /^(value|checked|disabled|type|class|style|id|autofocus|autocomplete|autocorrect)$/i;
/**
 * @param {?} srcElement
 * @param {?} destElement
 * @return {?}
 */
function copyInputAttributes(srcElement, destElement) {
    // copy attributes from one element to another
    // however, skip over a few of them as they're already
    // handled in the angular world
    var /** @type {?} */attrs = srcElement.attributes;
    for (var /** @type {?} */i = 0; i < attrs.length; i++) {
        var /** @type {?} */attr = attrs[i];
        if (!skipInputAttrsReg.test(attr.name)) {
            destElement.setAttribute(attr.name, attr.value);
        }
    }
}
//# sourceMappingURL=dom.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlatformConfigToken = exports.PLATFORM_CONFIGS = undefined;
exports.providePlatformConfigs = providePlatformConfigs;

var _core = require('@angular/core');

var _platformUtils = require('./platform-utils');

var /** @type {?} */PLATFORM_CONFIGS = exports.PLATFORM_CONFIGS = {
    /**
     * core
     */
    'core': {
        settings: {
            mode: 'md',
            keyboardHeight: 290
        }
    },
    /**
     * mobile
     */
    'mobile': {},
    /**
     * phablet
     */
    'phablet': {
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            var /** @type {?} */smallest = Math.min(plt.width(), plt.height());
            var /** @type {?} */largest = Math.max(plt.width(), plt.height());
            return smallest > 390 && smallest < 520 && largest > 620 && largest < 800;
        }
    },
    /**
     * tablet
     */
    'tablet': {
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            var /** @type {?} */smallest = Math.min(plt.width(), plt.height());
            var /** @type {?} */largest = Math.max(plt.width(), plt.height());
            return smallest > 460 && smallest < 820 && largest > 780 && largest < 1400;
        }
    },
    /**
     * android
     */
    'android': {
        superset: 'mobile',
        subsets: ['phablet', 'tablet'],
        settings: {
            activator: function activator(plt) {
                // md mode defaults to use ripple activator
                // however, under-powered devices shouldn't use ripple
                // if this a linux device, and is using Android Chrome v36 (Android 5.0)
                // or above then use ripple, otherwise do not use a ripple effect
                if (plt.testNavigatorPlatform('linux')) {
                    var /** @type {?} */chromeVersion = plt.matchUserAgentVersion(/Chrome\/(\d+).(\d+)?/);
                    if (chromeVersion) {
                        // linux android device using modern android chrome browser gets ripple
                        if (parseInt(chromeVersion.major, 10) < 36 || plt.version().major < 5) {
                            return 'none';
                        } else {
                            return 'ripple';
                        }
                    }
                    // linux android device not using chrome browser checks just android's version
                    if (plt.version().major < 5) {
                        return 'none';
                    }
                }
                // fallback to always use ripple
                return 'ripple';
            },
            autoFocusAssist: 'immediate',
            inputCloning: true,
            scrollAssist: true,
            hoverCSS: false,
            keyboardHeight: 300,
            mode: 'md'
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('android', ['android', 'silk'], ['windows phone']);
        },

        /**
         * @param {?} plt
         * @return {?}
         */
        versionParser: function versionParser(plt) {
            return plt.matchUserAgentVersion(/Android (\d+).(\d+)?/);
        }
    },
    /**
     * ios
     */
    'ios': {
        superset: 'mobile',
        subsets: ['ipad', 'iphone'],
        settings: {
            autoFocusAssist: 'delay',
            hoverCSS: false,
            inputBlurring: _platformUtils.isIos,
            inputCloning: _platformUtils.isIos,
            keyboardHeight: 300,
            mode: 'ios',
            scrollAssist: _platformUtils.isIos,
            statusbarPadding: _platformUtils.isCordova,
            swipeBackEnabled: _platformUtils.isIos,
            tapPolyfill: _platformUtils.isIosUIWebView,
            virtualScrollEventAssist: _platformUtils.isIosUIWebView,
            disableScrollAssist: _platformUtils.isIos
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('ios', ['iphone', 'ipad', 'ipod'], ['windows phone']);
        },

        /**
         * @param {?} plt
         * @return {?}
         */
        versionParser: function versionParser(plt) {
            return plt.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
        }
    },
    /**
     * ipad
     */
    'ipad': {
        superset: 'tablet',
        settings: {
            keyboardHeight: 500
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('ipad');
        }
    },
    /**
     * iphone
     */
    'iphone': {
        subsets: ['phablet'],
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('iphone');
        }
    },
    /**
     * Windows
     */
    'windows': {
        superset: 'mobile',
        subsets: ['phablet', 'tablet'],
        settings: {
            mode: 'wp',
            autoFocusAssist: 'immediate',
            hoverCSS: false
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('windows', ['windows phone']);
        },

        /**
         * @param {?} plt
         * @return {?}
         */
        versionParser: function versionParser(plt) {
            return plt.matchUserAgentVersion(/Windows Phone (\d+).(\d+)?/);
        }
    },
    /**
     * cordova
     */
    'cordova': {
        isEngine: true,
        initialize: function initialize(plt) {
            // prepare a custom "ready" for cordova "deviceready"
            plt.prepareReady = function () {
                // 1) ionic bootstrapped
                plt.windowLoad(function (win, doc) {
                    // 2) window onload triggered or completed
                    doc.addEventListener('deviceready', function () {
                        // 3) cordova deviceready event triggered
                        // add cordova listeners to emit platform events
                        doc.addEventListener('backbutton', function (ev) {
                            plt.zone.run(function () {
                                plt.backButton.emit(ev);
                            });
                        });
                        doc.addEventListener('pause', function (ev) {
                            plt.zone.run(function () {
                                plt.pause.emit(ev);
                            });
                        });
                        doc.addEventListener('resume', function (ev) {
                            plt.zone.run(function () {
                                plt.resume.emit(ev);
                            });
                        });
                        // cordova has its own exitApp method
                        plt.exitApp = function () {
                            win['navigator']['app'].exitApp();
                        };
                        // cordova has fully loaded and we've added listeners
                        plt.triggerReady('cordova');
                    });
                });
            };
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return (0, _platformUtils.isCordova)(plt);
        }
    },
    /**
     * electron
     */
    'electron': {
        superset: 'core',
        initialize: function initialize(plt) {
            plt.prepareReady = function () {
                // 1) ionic bootstrapped
                plt.windowLoad(function () {
                    plt.triggerReady('electron');
                });
            };
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return (0, _platformUtils.isElectron)(plt);
        }
    }
};
var /** @type {?} */PlatformConfigToken = exports.PlatformConfigToken = new _core.OpaqueToken('PLTCONFIG');
/**
 * @return {?}
 */
function providePlatformConfigs() {
    return PLATFORM_CONFIGS;
}
//# sourceMappingURL=platform-registry.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isCordova = isCordova;
exports.isElectron = isElectron;
exports.isIos = isIos;
exports.isSafari = isSafari;
exports.isWKWebView = isWKWebView;
exports.isIosUIWebView = isIosUIWebView;
/**
 * @param {?} plt
 * @return {?}
 */
function isCordova(plt) {
    var /** @type {?} */win = plt.win();
    return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
}
/**
 * @param {?} plt
 * @return {?}
 */
function isElectron(plt) {
    return plt.testUserAgent('Electron');
}
/**
 * @param {?} plt
 * @return {?}
 */
function isIos(plt) {
    // shortcut function to be reused internally
    // checks navigator.platform to see if it's an actual iOS device
    // this does not use the user-agent string because it is often spoofed
    // an actual iPad will return true, a chrome dev tools iPad will return false
    return plt.testNavigatorPlatform('iphone|ipad|ipod');
}
/**
 * @param {?} plt
 * @return {?}
 */
function isSafari(plt) {
    return plt.testUserAgent('Safari');
}
/**
 * @param {?} plt
 * @return {?}
 */
function isWKWebView(plt) {
    return isIos(plt) && !!plt.win()['webkit'];
}
/**
 * @param {?} plt
 * @return {?}
 */
function isIosUIWebView(plt) {
    return isIos(plt) && !isWKWebView(plt) && !isSafari(plt);
}
//# sourceMappingURL=platform-utils.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Platform = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

exports.setupPlatform = setupPlatform;

var _core = require('@angular/core');

var _dom = require('../util/dom');

var _queryParams = require('./query-params');

var _util = require('../util/util');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * \@name Platform
 * \@description
 * The Platform service can be used to get information about your current device.
 * You can get all of the platforms associated with the device using the [platforms](#platforms)
 * method, including whether the app is being viewed from a tablet, if it's
 * on a mobile device or browser, and the exact platform (iOS, Android, etc).
 * You can also get the orientation of the device, if it uses right-to-left
 * language direction, and much much more. With this information you can completely
 * customize your app to fit any device.
 *
 * \@usage
 * ```ts
 * import { Platform } from 'ionic-angular';
 *
 * \@Component({...})
 * export MyPage {
 *   constructor(public plt: Platform) {
 *
 *   }
 * }
 * ```
 * \@demo /docs/demos/src/platform/
 */
var Platform = function () {
    function Platform() {
        var _this = this;

        _classCallCheck(this, Platform);

        this._versions = {};
        this._qp = new _queryParams.QueryParams();
        this._bbActions = [];
        this._pW = 0;
        this._pH = 0;
        this._lW = 0;
        this._lH = 0;
        this._isPortrait = null;
        this._uiEvtOpts = false;
        /**
         * \@internal
         */
        this._platforms = [];
        /**
         * @hidden
         */
        this.backButton = new _core.EventEmitter();
        /**
         * The pause event emits when the native platform puts the application
         * into the background, typically when the user switches to a different
         * application. This event would emit when a Cordova app is put into
         * the background, however, it would not fire on a standard web browser.
         */
        this.pause = new _core.EventEmitter();
        /**
         * The resume event emits when the native platform pulls the application
         * out from the background. This event would emit when a Cordova app comes
         * out from the background, however, it would not fire on a standard web browser.
         */
        this.resume = new _core.EventEmitter();
        /**
         * The resize event emits when the native platform pulls the application
         * out from the background. This event would emit when a Cordova app comes
         * out from the background, however, it would not fire on a standard web browser.
         */
        this.resize = new _core.EventEmitter();
        this._readyPromise = new Promise(function (res) {
            _this._readyResolve = res;
        });
        this.backButton.subscribe(function () {
            // the hardware back button event has been fired
            void 0;
            // decide which backbutton action should run
            _this.runBackButtonAction();
        });
    }
    /**
     * @hidden
     * @param {?} win
     * @return {?}
     */

    _createClass(Platform, [{
        key: 'setWindow',
        value: function setWindow(win) {
            this._win = win;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'win',
        value: function win() {
            return this._win;
        }
        /**
         * @hidden
         * @param {?} doc
         * @return {?}
         */

    }, {
        key: 'setDocument',
        value: function setDocument(doc) {
            this._doc = doc;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'doc',
        value: function doc() {
            return this._doc;
        }
        /**
         * @hidden
         * @param {?} zone
         * @return {?}
         */

    }, {
        key: 'setZone',
        value: function setZone(zone) {
            this.zone = zone;
        }
        /**
         * @hidden
         * @param {?} docElement
         * @return {?}
         */

    }, {
        key: 'setCssProps',
        value: function setCssProps(docElement) {
            this.Css = (0, _dom.getCss)(docElement);
        }
        /**
         * \@description
         * Depending on the platform the user is on, `is(platformName)` will
         * return `true` or `false`. Note that the same app can return `true`
         * for more than one platform name. For example, an app running from
         * an iPad would return `true` for the platform names: `mobile`,
         * `ios`, `ipad`, and `tablet`. Additionally, if the app was running
         * from Cordova then `cordova` would be true, and if it was running
         * from a web browser on the iPad then `mobileweb` would be `true`.
         *
         * ```
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyPage {
         *   constructor(public plt: Platform) {
         *     if (this.plt.is('ios')) {
         *       // This will only print when on iOS
         *       console.log("I'm an iOS device!");
         *     }
         *   }
         * }
         * ```
         *
         * | Platform Name   | Description                        |
         * |-----------------|------------------------------------|
         * | android         | on a device running Android.       |
         * | cordova         | on a device running Cordova.       |
         * | core            | on a desktop device.               |
         * | ios             | on a device running iOS.           |
         * | ipad            | on an iPad device.                 |
         * | iphone          | on an iPhone device.               |
         * | mobile          | on a mobile device.                |
         * | mobileweb       | in a browser on a mobile device.   |
         * | phablet         | on a phablet device.               |
         * | tablet          | on a tablet device.                |
         * | windows         | on a device running Windows.       |
         *
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'is',
        value: function is(platformName) {
            return this._platforms.indexOf(platformName) > -1;
        }
        /**
         * \@description
         * Depending on what device you are on, `platforms` can return multiple values.
         * Each possible value is a hierarchy of platforms. For example, on an iPhone,
         * it would return `mobile`, `ios`, and `iphone`.
         *
         * ```
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyPage {
         *   constructor(public plt: Platform) {
         *     // This will print an array of the current platforms
         *     console.log(this.plt.platforms());
         *   }
         * }
         * ```
         * @return {?}
         */

    }, {
        key: 'platforms',
        value: function platforms() {
            // get the array of active platforms, which also knows the hierarchy,
            // with the last one the most important
            return this._platforms;
        }
        /**
         * Returns an object containing version information about all of the platforms.
         *
         * ```
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyPage {
         *   constructor(public plt: Platform) {
         *     // This will print an object containing
         *     // all of the platforms and their versions
         *     console.log(plt.versions());
         *   }
         * }
         * ```
         *
         * @return {?}
         */

    }, {
        key: 'versions',
        value: function versions() {
            // get all the platforms that have a valid parsed version
            return this._versions;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'version',
        value: function version() {
            for (var /** @type {?} */platformName in this._versions) {
                if (this._versions[platformName]) {
                    return this._versions[platformName];
                }
            }
            return {};
        }
        /**
         * Returns a promise when the platform is ready and native functionality
         * can be called. If the app is running from within a web browser, then
         * the promise will resolve when the DOM is ready. When the app is running
         * from an application engine such as Cordova, then the promise will
         * resolve when Cordova triggers the `deviceready` event.
         *
         * The resolved value is the `readySource`, which states which platform
         * ready was used. For example, when Cordova is ready, the resolved ready
         * source is `cordova`. The default ready source value will be `dom`. The
         * `readySource` is useful if different logic should run depending on the
         * platform the app is running from. For example, only Cordova can execute
         * the status bar plugin, so the web should not run status bar plugin logic.
         *
         * ```
         * import { Component } from '\@angular/core';
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyApp {
         *   constructor(public plt: Platform) {
         *     this.plt.ready().then((readySource) => {
         *       console.log('Platform ready from', readySource);
         *       // Platform now ready, execute any required native code
         *     });
         *   }
         * }
         * ```
         * @return {?}
         */

    }, {
        key: 'ready',
        value: function ready() {
            return this._readyPromise;
        }
        /**
         * @hidden
         * This should be triggered by the engine when the platform is
         * ready. If there was no custom prepareReady method from the engine,
         * such as Cordova or Electron, then it uses the default DOM ready.
         * @param {?} readySource
         * @return {?}
         */

    }, {
        key: 'triggerReady',
        value: function triggerReady(readySource) {
            var _this2 = this;

            this.zone.run(function () {
                _this2._readyResolve(readySource);
            });
        }
        /**
         * @hidden
         * This is the default prepareReady if it's not replaced by an engine,
         * such as Cordova or Electron. If there was no custom prepareReady
         * method from an engine then it uses the method below, which triggers
         * the platform ready on the DOM ready event, and the default resolved
         * value is `dom`.
         * @return {?}
         */

    }, {
        key: 'prepareReady',
        value: function prepareReady() {
            var /** @type {?} */self = this;
            if (self._doc.readyState === 'complete' || self._doc.readyState === 'interactive') {
                self.triggerReady('dom');
            } else {
                self._doc.addEventListener('DOMContentLoaded', completed, false);
                self._win.addEventListener('load', completed, false);
            }
            /**
             * @return {?}
             */
            function completed() {
                self._doc.removeEventListener('DOMContentLoaded', completed, false);
                self._win.removeEventListener('load', completed, false);
                self.triggerReady('dom');
            }
        }
        /**
         * Set the app's language direction, which will update the `dir` attribute
         * on the app's root `<html>` element. We recommend the app's `index.html`
         * file already has the correct `dir` attribute value set, such as
         * `<html dir="ltr">` or `<html dir="rtl">`. This method is useful if the
         * direction needs to be dynamically changed per user/session.
         * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
         * @param {?} dir
         * @param {?} updateDocument
         * @return {?}
         */

    }, {
        key: 'setDir',
        value: function setDir(dir, updateDocument) {
            this._dir = dir = (dir || '').toLowerCase();
            this.isRTL = dir === 'rtl';
            if (updateDocument !== false) {
                this._doc['documentElement'].setAttribute('dir', dir);
            }
        }
        /**
         * Returns app's language direction.
         * We recommend the app's `index.html` file already has the correct `dir`
         * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
         * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
         * @return {?}
         */

    }, {
        key: 'dir',
        value: function dir() {
            return this._dir;
        }
        /**
         * Set the app's language and optionally the country code, which will update
         * the `lang` attribute on the app's root `<html>` element.
         * We recommend the app's `index.html` file already has the correct `lang`
         * attribute value set, such as `<html lang="en">`. This method is useful if
         * the language needs to be dynamically changed per user/session.
         * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
         * @param {?} language
         * @param {?} updateDocument
         * @return {?}
         */

    }, {
        key: 'setLang',
        value: function setLang(language, updateDocument) {
            this._lang = language;
            if (updateDocument !== false) {
                this._doc['documentElement'].setAttribute('lang', language);
            }
        }
        /**
         * Returns app's language and optional country code.
         * We recommend the app's `index.html` file already has the correct `lang`
         * attribute value set, such as `<html lang="en">`.
         * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
         * @return {?}
         */

    }, {
        key: 'lang',
        value: function lang() {
            return this._lang;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'exitApp',
        value: function exitApp() {}
        /**
         * The back button event is triggered when the user presses the native
         * platform's back button, also referred to as the "hardware" back button.
         * This event is only used within Cordova apps running on Android and
         * Windows platforms. This event is not fired on iOS since iOS doesn't come
         * with a hardware back button in the same sense an Android or Windows device
         * does.
         *
         * Registering a hardware back button action and setting a priority allows
         * apps to control which action should be called when the hardware back
         * button is pressed. This method decides which of the registered back button
         * actions has the highest priority and should be called.
         *
         * if this registered action has the highest priority.
         * the back button action.
         * @param {?} fn
         * @param {?=} priority
         * @return {?}
         */

    }, {
        key: 'registerBackButtonAction',
        value: function registerBackButtonAction(fn) {
            var _this3 = this;

            var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var /** @type {?} */action = { fn: fn, priority: priority };
            this._bbActions.push(action);
            // return a function to unregister this back button action
            return function () {
                (0, _util.removeArrayItem)(_this3._bbActions, action);
            };
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'runBackButtonAction',
        value: function runBackButtonAction() {
            // decide which one back button action should run
            var /** @type {?} */winner = null;
            this._bbActions.forEach(function (action) {
                if (!winner || action.priority >= winner.priority) {
                    winner = action;
                }
            });
            // run the winning action if there is one
            winner && winner.fn && winner.fn();
        }
        /**
         * @hidden
         * @param {?} userAgent
         * @return {?}
         */

    }, {
        key: 'setUserAgent',
        value: function setUserAgent(userAgent) {
            this._ua = userAgent;
        }
        /**
         * @hidden
         * @param {?} url
         * @return {?}
         */

    }, {
        key: 'setQueryParams',
        value: function setQueryParams(url) {
            this._qp.parseUrl(url);
        }
        /**
         * Get the query string parameter
         * @param {?} key
         * @return {?}
         */

    }, {
        key: 'getQueryParam',
        value: function getQueryParam(key) {
            return this._qp.get(key);
        }
        /**
         * Get the current url.
         * @return {?}
         */

    }, {
        key: 'url',
        value: function url() {
            return this._win['location']['href'];
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'userAgent',
        value: function userAgent() {
            return this._ua || '';
        }
        /**
         * @hidden
         * @param {?} navigatorPlt
         * @return {?}
         */

    }, {
        key: 'setNavigatorPlatform',
        value: function setNavigatorPlatform(navigatorPlt) {
            this._nPlt = navigatorPlt;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'navigatorPlatform',
        value: function navigatorPlatform() {
            return this._nPlt || '';
        }
        /**
         * Gets the width of the platform's viewport using `window.innerWidth`.
         * Using this method is preferred since the dimension is a cached value,
         * which reduces the chance of multiple and expensive DOM reads.
         * @return {?}
         */

    }, {
        key: 'width',
        value: function width() {
            this._calcDim();
            return this._isPortrait ? this._pW : this._lW;
        }
        /**
         * Gets the height of the platform's viewport using `window.innerHeight`.
         * Using this method is preferred since the dimension is a cached value,
         * which reduces the chance of multiple and expensive DOM reads.
         * @return {?}
         */

    }, {
        key: 'height',
        value: function height() {
            this._calcDim();
            return this._isPortrait ? this._pH : this._lH;
        }
        /**
         * @hidden
         * @param {?} ele
         * @param {?=} pseudoEle
         * @return {?}
         */

    }, {
        key: 'getElementComputedStyle',
        value: function getElementComputedStyle(ele, pseudoEle) {
            return this._win['getComputedStyle'](ele, pseudoEle);
        }
        /**
         * @hidden
         * @param {?} x
         * @param {?} y
         * @return {?}
         */

    }, {
        key: 'getElementFromPoint',
        value: function getElementFromPoint(x, y) {
            return this._doc['elementFromPoint'](x, y);
        }
        /**
         * @hidden
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: 'getElementBoundingClientRect',
        value: function getElementBoundingClientRect(ele) {
            return ele['getBoundingClientRect']();
        }
        /**
         * Returns `true` if the app is in portait mode.
         * @return {?}
         */

    }, {
        key: 'isPortrait',
        value: function isPortrait() {
            this._calcDim();
            return this._isPortrait;
        }
        /**
         * Returns `true` if the app is in landscape mode.
         * @return {?}
         */

    }, {
        key: 'isLandscape',
        value: function isLandscape() {
            return !this.isPortrait();
        }
        /**
         * @return {?}
         */

    }, {
        key: '_calcDim',
        value: function _calcDim() {
            // we're caching window dimensions so that
            // we're not forcing many layouts
            // if _isPortrait is null then that means
            // the dimensions needs to be looked up again
            // this also has to cover an edge case that only
            // happens on iOS 10 (not other versions of iOS)
            // where window.innerWidth is always bigger than
            // window.innerHeight when it is first measured,
            // even when the device is in portrait but
            // the second time it is measured it is correct.
            // Hopefully this check will not be needed in the future
            if (this._isPortrait === null || this._isPortrait === false && this._win['innerWidth'] < this._win['innerHeight']) {
                var /** @type {?} */win = this._win;
                var /** @type {?} */innerWidth = win['innerWidth'];
                var /** @type {?} */innerHeight = win['innerHeight'];
                // we're keeping track of portrait and landscape dimensions
                // separately because the virtual keyboard can really mess
                // up accurate values when the keyboard is up
                if (win.screen.width > 0 && win.screen.height > 0) {
                    if (innerWidth < innerHeight) {
                        // the device is in portrait
                        // we have to do fancier checking here
                        // because of the virtual keyboard resizing
                        // the window
                        if (this._pW <= innerWidth) {
                            void 0;
                            this._isPortrait = true;
                            this._pW = innerWidth;
                        }
                        if (this._pH <= innerHeight) {
                            void 0;
                            this._isPortrait = true;
                            this._pH = innerHeight;
                        }
                    } else {
                        // the device is in landscape
                        if (this._lW !== innerWidth) {
                            void 0;
                            this._isPortrait = false;
                            this._lW = innerWidth;
                        }
                        if (this._lH !== innerHeight) {
                            void 0;
                            this._isPortrait = false;
                            this._lH = innerHeight;
                        }
                    }
                }
            }
        }
        /**
         * @hidden
         * This requestAnimationFrame will NOT be wrapped by zone.
         * @param {?} callback
         * @return {?}
         */

    }, {
        key: 'raf',
        value: function raf(callback) {
            var /** @type {?} */win = this._win;
            return win['__zone_symbol__requestAnimationFrame'](callback);
        }
        /**
         * @hidden
         * @param {?} rafId
         * @return {?}
         */

    }, {
        key: 'cancelRaf',
        value: function cancelRaf(rafId) {
            var /** @type {?} */win = this._win;
            return win['__zone_symbol__cancelAnimationFrame'](rafId);
        }
        /**
         * @hidden
         * This setTimeout will NOT be wrapped by zone.
         * @param {?} callback
         * @param {?=} timeout
         * @return {?}
         */

    }, {
        key: 'timeout',
        value: function timeout(callback, _timeout) {
            var /** @type {?} */win = this._win;
            return win['__zone_symbol__setTimeout'](callback, _timeout);
        }
        /**
         * @hidden
         * This setTimeout will NOT be wrapped by zone.
         * @param {?} timeoutId
         * @return {?}
         */

    }, {
        key: 'cancelTimeout',
        value: function cancelTimeout(timeoutId) {
            var /** @type {?} */win = this._win;
            win['__zone_symbol__clearTimeout'](timeoutId);
        }
        /**
         * @hidden
         * Built to use modern event listener options, like "passive".
         * If options are not supported, then just return a boolean which
         * represents "capture". Returns a method to remove the listener.
         * @param {?} ele
         * @param {?} eventName
         * @param {?} callback
         * @param {?} opts
         * @param {?=} unregisterListenersCollection
         * @return {?}
         */

    }, {
        key: 'registerListener',
        value: function registerListener(ele, eventName, callback, opts, unregisterListenersCollection) {
            // use event listener options when supported
            // otherwise it's just a boolean for the "capture" arg
            var /** @type {?} */listenerOpts = this._uiEvtOpts ? {
                'capture': !!opts.capture,
                'passive': !!opts.passive
            } : !!opts.capture;
            var /** @type {?} */unReg = void 0;
            if (!opts.zone && ele['__zone_symbol__addEventListener']) {
                // do not wrap this event in zone and we've verified we can use the raw addEventListener
                ele['__zone_symbol__addEventListener'](eventName, callback, listenerOpts);
                unReg = function unregisterListener() {
                    ele['__zone_symbol__removeEventListener'](eventName, callback, listenerOpts);
                };
            } else {
                // use the native addEventListener, which is wrapped with zone
                ele['addEventListener'](eventName, callback, listenerOpts);
                unReg = function unregisterListener() {
                    ele['removeEventListener'](eventName, callback, listenerOpts);
                };
            }
            if (unregisterListenersCollection) {
                unregisterListenersCollection.push(unReg);
            }
            return unReg;
        }
        /**
         * @hidden
         * @param {?} el
         * @param {?} callback
         * @param {?=} zone
         * @return {?}
         */

    }, {
        key: 'transitionEnd',
        value: function transitionEnd(el, callback) {
            var zone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var /** @type {?} */unRegs = [];
            /**
             * @return {?}
             */
            function unregister() {
                unRegs.forEach(function (unReg) {
                    unReg();
                });
            }
            /**
             * @param {?} ev
             * @return {?}
             */
            function onTransitionEnd(ev) {
                if (el === ev.target) {
                    unregister();
                    callback(ev);
                }
            }
            if (el) {
                this.registerListener(el, 'webkitTransitionEnd', /** @type {?} */onTransitionEnd, { zone: zone }, unRegs);
                this.registerListener(el, 'transitionend', /** @type {?} */onTransitionEnd, { zone: zone }, unRegs);
            }
            return unregister;
        }
        /**
         * @hidden
         * @param {?} callback
         * @return {?}
         */

    }, {
        key: 'windowLoad',
        value: function windowLoad(callback) {
            var /** @type {?} */win = this._win;
            var /** @type {?} */doc = this._doc;
            var /** @type {?} */unreg = void 0;
            if (doc.readyState === 'complete') {
                callback(win, doc);
            } else {
                unreg = this.registerListener(win, 'load', function () {
                    unreg && unreg();
                    callback(win, doc);
                }, { zone: false });
            }
        }
        /**
         * @hidden
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: 'isActiveElement',
        value: function isActiveElement(ele) {
            return !!(ele && this.getActiveElement() === ele);
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'getActiveElement',
        value: function getActiveElement() {
            return this._doc['activeElement'];
        }
        /**
         * @hidden
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: 'hasFocus',
        value: function hasFocus(ele) {
            return !!(ele && this.getActiveElement() === ele && ele.parentElement.querySelector(':focus') === ele);
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'hasFocusedTextInput',
        value: function hasFocusedTextInput() {
            var /** @type {?} */ele = this.getActiveElement();
            if ((0, _dom.isTextInput)(ele)) {
                return ele.parentElement.querySelector(':focus') === ele;
            }
            return false;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'focusOutActiveElement',
        value: function focusOutActiveElement() {
            var /** @type {?} */activeElement = this.getActiveElement();
            activeElement && activeElement.blur && activeElement.blur();
        }
        /**
         * @return {?}
         */

    }, {
        key: '_initEvents',
        value: function _initEvents() {
            var _this4 = this;

            // Test via a getter in the options object to see if the passive property is accessed
            try {
                var /** @type {?} */opts = Object.defineProperty({}, 'passive', {
                    get: function get() {
                        _this4._uiEvtOpts = true;
                    }
                });
                this._win.addEventListener('optsTest', null, opts);
            } catch (e) {}
            // add the window resize event listener XXms after
            this.timeout(function () {
                var /** @type {?} */timerId;
                _this4.registerListener(_this4._win, 'resize', function () {
                    clearTimeout(timerId);
                    timerId = setTimeout(function () {
                        // setting _isPortrait to null means the
                        // dimensions will need to be looked up again
                        if (_this4.hasFocusedTextInput() === false) {
                            _this4._isPortrait = null;
                        }
                        _this4.zone.run(function () {
                            return _this4.resize.emit();
                        });
                    }, 200);
                }, { passive: true, zone: false });
            }, 2000);
        }
        /**
         * @hidden
         * @param {?} platformConfigs
         * @return {?}
         */

    }, {
        key: 'setPlatformConfigs',
        value: function setPlatformConfigs(platformConfigs) {
            this._registry = platformConfigs || {};
        }
        /**
         * @hidden
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'getPlatformConfig',
        value: function getPlatformConfig(platformName) {
            return this._registry[platformName] || {};
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'registry',
        value: function registry() {
            return this._registry;
        }
        /**
         * @hidden
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'setDefault',
        value: function setDefault(platformName) {
            this._default = platformName;
        }
        /**
         * @hidden
         * @param {?} queryValue
         * @param {?} queryTestValue
         * @return {?}
         */

    }, {
        key: 'testQuery',
        value: function testQuery(queryValue, queryTestValue) {
            var /** @type {?} */valueSplit = queryValue.toLowerCase().split(';');
            return valueSplit.indexOf(queryTestValue) > -1;
        }
        /**
         * @hidden
         * @param {?} navigatorPlatformExpression
         * @return {?}
         */

    }, {
        key: 'testNavigatorPlatform',
        value: function testNavigatorPlatform(navigatorPlatformExpression) {
            var /** @type {?} */rgx = new RegExp(navigatorPlatformExpression, 'i');
            return rgx.test(this._nPlt);
        }
        /**
         * @hidden
         * @param {?} userAgentExpression
         * @return {?}
         */

    }, {
        key: 'matchUserAgentVersion',
        value: function matchUserAgentVersion(userAgentExpression) {
            if (this._ua && userAgentExpression) {
                var /** @type {?} */val = this._ua.match(userAgentExpression);
                if (val) {
                    return {
                        major: val[1],
                        minor: val[2]
                    };
                }
            }
        }
        /**
         * @param {?} expression
         * @return {?}
         */

    }, {
        key: 'testUserAgent',
        value: function testUserAgent(expression) {
            if (this._ua) {
                return this._ua.indexOf(expression) >= 0;
            }
            return false;
        }
        /**
         * @hidden
         * @param {?} queryStringName
         * @param {?=} userAgentAtLeastHas
         * @param {?=} userAgentMustNotHave
         * @return {?}
         */

    }, {
        key: 'isPlatformMatch',
        value: function isPlatformMatch(queryStringName, userAgentAtLeastHas) {
            var userAgentMustNotHave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            var /** @type {?} */queryValue = this._qp.get('ionicplatform');
            if (queryValue) {
                return this.testQuery(queryValue, queryStringName);
            }
            userAgentAtLeastHas = userAgentAtLeastHas || [queryStringName];
            var /** @type {?} */userAgent = this._ua.toLowerCase();
            for (var /** @type {?} */i = 0; i < userAgentAtLeastHas.length; i++) {
                if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
                    for (var /** @type {?} */j = 0; j < userAgentMustNotHave.length; j++) {
                        if (userAgent.indexOf(userAgentMustNotHave[j]) > -1) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'init',
        value: function init() {
            this._initEvents();
            var /** @type {?} */rootPlatformNode = void 0;
            var /** @type {?} */enginePlatformNode = void 0;
            // figure out the most specific platform and active engine
            var /** @type {?} */tmpPlt = void 0;
            for (var /** @type {?} */platformName in this._registry) {
                tmpPlt = this.matchPlatform(platformName);
                if (tmpPlt) {
                    // we found a platform match!
                    // check if its more specific than the one we already have
                    if (tmpPlt.isEngine) {
                        // because it matched then this should be the active engine
                        // you cannot have more than one active engine
                        enginePlatformNode = tmpPlt;
                    } else if (!rootPlatformNode || tmpPlt.depth > rootPlatformNode.depth) {
                        // only find the root node for platforms that are not engines
                        // set this node as the root since we either don't already
                        // have one, or this one is more specific that the current one
                        rootPlatformNode = tmpPlt;
                    }
                }
            }
            if (!rootPlatformNode) {
                rootPlatformNode = new PlatformNode(this._registry, this._default);
            }
            // build a Platform instance filled with the
            // hierarchy of active platforms and settings
            if (rootPlatformNode) {
                // check if we found an engine node (cordova/node-webkit/etc)
                if (enginePlatformNode) {
                    // add the engine to the first in the platform hierarchy
                    // the original rootPlatformNode now becomes a child
                    // of the engineNode, which is not the new root
                    enginePlatformNode.child = rootPlatformNode;
                    rootPlatformNode.parent = enginePlatformNode;
                    rootPlatformNode = enginePlatformNode;
                }
                var /** @type {?} */platformNode = rootPlatformNode;
                while (platformNode) {
                    insertSuperset(this._registry, platformNode);
                    platformNode = platformNode.child;
                }
                // make sure the root noot is actually the root
                // incase a node was inserted before the root
                platformNode = rootPlatformNode.parent;
                while (platformNode) {
                    rootPlatformNode = platformNode;
                    platformNode = platformNode.parent;
                }
                platformNode = rootPlatformNode;
                while (platformNode) {
                    platformNode.initialize(this);
                    // extra check for ipad pro issue
                    // https://forums.developer.apple.com/thread/25948
                    if (platformNode.name === 'iphone' && this.navigatorPlatform() === 'iPad') {
                        // this is an ipad pro so push ipad and tablet to platforms
                        // and then return as we are done
                        this._platforms.push('tablet');
                        this._platforms.push('ipad');
                        return;
                    }
                    // set the array of active platforms with
                    // the last one in the array the most important
                    this._platforms.push(platformNode.name);
                    // get the platforms version if a version parser was provided
                    this._versions[platformNode.name] = platformNode.version(this);
                    // go to the next platform child
                    platformNode = platformNode.child;
                }
            }
            if (this._platforms.indexOf('mobile') > -1 && this._platforms.indexOf('cordova') === -1) {
                this._platforms.push('mobileweb');
            }
        }
        /**
         * @hidden
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'matchPlatform',
        value: function matchPlatform(platformName) {
            // build a PlatformNode and assign config data to it
            // use it's getRoot method to build up its hierarchy
            // depending on which platforms match
            var /** @type {?} */platformNode = new PlatformNode(this._registry, platformName);
            var /** @type {?} */rootNode = platformNode.getRoot(this);
            if (rootNode) {
                rootNode.depth = 0;
                var /** @type {?} */childPlatform = rootNode.child;
                while (childPlatform) {
                    rootNode.depth++;
                    childPlatform = childPlatform.child;
                }
            }
            return rootNode;
        }
    }]);

    return Platform;
}();

exports.Platform = Platform;

function Platform_tsickle_Closure_declarations() {
    /** @type {?} */
    Platform.prototype._win;
    /** @type {?} */
    Platform.prototype._doc;
    /** @type {?} */
    Platform.prototype._versions;
    /** @type {?} */
    Platform.prototype._dir;
    /** @type {?} */
    Platform.prototype._lang;
    /** @type {?} */
    Platform.prototype._ua;
    /** @type {?} */
    Platform.prototype._qp;
    /** @type {?} */
    Platform.prototype._nPlt;
    /** @type {?} */
    Platform.prototype._readyPromise;
    /** @type {?} */
    Platform.prototype._readyResolve;
    /** @type {?} */
    Platform.prototype._bbActions;
    /** @type {?} */
    Platform.prototype._registry;
    /** @type {?} */
    Platform.prototype._default;
    /** @type {?} */
    Platform.prototype._pW;
    /** @type {?} */
    Platform.prototype._pH;
    /** @type {?} */
    Platform.prototype._lW;
    /** @type {?} */
    Platform.prototype._lH;
    /** @type {?} */
    Platform.prototype._isPortrait;
    /** @type {?} */
    Platform.prototype._uiEvtOpts;
    /**
     * @hidden
     * @type {?}
     */
    Platform.prototype.zone;
    /**
     * \@internal
     * @type {?}
     */
    Platform.prototype.Css;
    /**
     * \@internal
     * @type {?}
     */
    Platform.prototype._platforms;
    /**
     * Returns if this app is using right-to-left language direction or not.
     * We recommend the app's `index.html` file already has the correct `dir`
     * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @type {?}
     */
    Platform.prototype.isRTL;
    /**
     * @hidden
     * @type {?}
     */
    Platform.prototype.backButton;
    /**
     * The pause event emits when the native platform puts the application
     * into the background, typically when the user switches to a different
     * application. This event would emit when a Cordova app is put into
     * the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.pause;
    /**
     * The resume event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.resume;
    /**
     * The resize event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.resize;
}
/**
 * @param {?} registry
 * @param {?} platformNode
 * @return {?}
 */
function insertSuperset(registry, platformNode) {
    var /** @type {?} */supersetPlaformName = platformNode.superset();
    if (supersetPlaformName) {
        // add a platform in between two exist platforms
        // so we can build the correct hierarchy of active platforms
        var /** @type {?} */supersetPlatform = new PlatformNode(registry, supersetPlaformName);
        supersetPlatform.parent = platformNode.parent;
        supersetPlatform.child = platformNode;
        if (supersetPlatform.parent) {
            supersetPlatform.parent.child = supersetPlatform;
        }
        platformNode.parent = supersetPlatform;
    }
}
/**
 * @hidden
 */

var PlatformNode = function () {
    /**
     * @param {?} registry
     * @param {?} platformName
     */
    function PlatformNode(registry, platformName) {
        _classCallCheck(this, PlatformNode);

        this.registry = registry;
        this.c = registry[platformName];
        this.name = platformName;
        this.isEngine = this.c.isEngine;
    }
    /**
     * @return {?}
     */

    _createClass(PlatformNode, [{
        key: 'settings',
        value: function settings() {
            return this.c.settings || {};
        }
        /**
         * @return {?}
         */

    }, {
        key: 'superset',
        value: function superset() {
            return this.c.superset;
        }
        /**
         * @param {?} p
         * @return {?}
         */

    }, {
        key: 'isMatch',
        value: function isMatch(p) {
            return this.c.isMatch && this.c.isMatch(p) || false;
        }
        /**
         * @param {?} plt
         * @return {?}
         */

    }, {
        key: 'initialize',
        value: function initialize(plt) {
            this.c.initialize && this.c.initialize(plt);
        }
        /**
         * @param {?} plt
         * @return {?}
         */

    }, {
        key: 'version',
        value: function version(plt) {
            if (this.c.versionParser) {
                var /** @type {?} */v = this.c.versionParser(plt);
                if (v) {
                    var /** @type {?} */str = v.major + '.' + v.minor;
                    return {
                        str: str,
                        num: parseFloat(str),
                        major: parseInt(v.major, 10),
                        minor: parseInt(v.minor, 10)
                    };
                }
            }
        }
        /**
         * @param {?} plt
         * @return {?}
         */

    }, {
        key: 'getRoot',
        value: function getRoot(plt) {
            if (this.isMatch(plt)) {
                var /** @type {?} */parents = this.getSubsetParents(this.name);
                if (!parents.length) {
                    return this;
                }
                var /** @type {?} */platformNode = null;
                var /** @type {?} */rootPlatformNode = null;
                for (var /** @type {?} */i = 0; i < parents.length; i++) {
                    platformNode = new PlatformNode(this.registry, parents[i]);
                    platformNode.child = this;
                    rootPlatformNode = platformNode.getRoot(plt);
                    if (rootPlatformNode) {
                        this.parent = platformNode;
                        return rootPlatformNode;
                    }
                }
            }
            return null;
        }
        /**
         * @param {?} subsetPlatformName
         * @return {?}
         */

    }, {
        key: 'getSubsetParents',
        value: function getSubsetParents(subsetPlatformName) {
            var /** @type {?} */parentPlatformNames = [];
            var /** @type {?} */pltConfig = null;
            for (var /** @type {?} */platformName in this.registry) {
                pltConfig = this.registry[platformName];
                if (pltConfig.subsets && pltConfig.subsets.indexOf(subsetPlatformName) > -1) {
                    parentPlatformNames.push(platformName);
                }
            }
            return parentPlatformNames;
        }
    }]);

    return PlatformNode;
}();

function PlatformNode_tsickle_Closure_declarations() {
    /** @type {?} */
    PlatformNode.prototype.c;
    /** @type {?} */
    PlatformNode.prototype.parent;
    /** @type {?} */
    PlatformNode.prototype.child;
    /** @type {?} */
    PlatformNode.prototype.name;
    /** @type {?} */
    PlatformNode.prototype.isEngine;
    /** @type {?} */
    PlatformNode.prototype.depth;
    /** @type {?} */
    PlatformNode.prototype.registry;
}
/**
 * @hidden
 * @param {?} doc
 * @param {?} platformConfigs
 * @param {?} zone
 * @return {?}
 */
function setupPlatform(doc, platformConfigs, zone) {
    var /** @type {?} */plt = new Platform();
    plt.setDefault('core');
    plt.setPlatformConfigs(platformConfigs);
    plt.setZone(zone);
    // set values from "document"
    var /** @type {?} */docElement = doc.documentElement;
    plt.setDocument(doc);
    plt.setDir(docElement.dir, false);
    plt.setLang(docElement.lang, false);
    // set css properties
    plt.setCssProps(docElement);
    // set values from "window"
    var /** @type {?} */win = doc.defaultView;
    plt.setWindow(win);
    plt.setNavigatorPlatform(win.navigator.platform);
    plt.setUserAgent(win.navigator.userAgent);
    // set location values
    plt.setQueryParams(win.location.href);
    plt.init();
    // add the platform obj to the window
    win['Ionic'] = win['Ionic'] || {};
    win['Ionic']['platform'] = plt;
    return plt;
}
//# sourceMappingURL=platform.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * @hidden
 */
var QueryParams = exports.QueryParams = function () {
    function QueryParams() {
        _classCallCheck(this, QueryParams);

        this.data = {};
    }
    /**
     * @param {?} url
     * @return {?}
     */

    _createClass(QueryParams, [{
        key: 'parseUrl',
        value: function parseUrl(url) {
            if (url) {
                var /** @type {?} */startIndex = url.indexOf('?');
                if (startIndex > -1) {
                    var /** @type {?} */queries = url.slice(startIndex + 1).split('&');
                    for (var /** @type {?} */i = 0; i < queries.length; i++) {
                        if (queries[i].indexOf('=') > 0) {
                            var /** @type {?} */split = queries[i].split('=');
                            if (split.length > 1) {
                                this.data[split[0].toLowerCase()] = split[1].split('#')[0];
                            }
                        }
                    }
                }
            }
        }
        /**
         * @param {?} key
         * @return {?}
         */

    }, {
        key: 'get',
        value: function get(key) {
            return this.data[key.toLowerCase()];
        }
    }]);

    return QueryParams;
}();

function QueryParams_tsickle_Closure_declarations() {
    /** @type {?} */
    QueryParams.prototype.data;
}
//# sourceMappingURL=query-params.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

exports.clamp = clamp;
exports.deepCopy = deepCopy;
exports.deepEqual = deepEqual;
exports.debounce = debounce;
exports.normalizeURL = normalizeURL;
exports.defaults = defaults;
exports.isBoolean = isBoolean;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isFunction = isFunction;
exports.isDefined = isDefined;
exports.isUndefined = isUndefined;
exports.isPresent = isPresent;
exports.isBlank = isBlank;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isPrimitive = isPrimitive;
exports.isTrueProperty = isTrueProperty;
exports.isCheckedProperty = isCheckedProperty;
exports.isRightSide = isRightSide;
exports.reorderArray = reorderArray;
exports.removeArrayItem = removeArrayItem;
exports.swipeShouldReset = swipeShouldReset;
exports.requestIonicCallback = requestIonicCallback;
/**
 * @hidden
 * Given a min and max, restrict the given number
 * to the range.
 * @param {?} min the minimum
 * @param {?} n the value
 * @param {?} max the maximum
 * @return {?}
 */
function clamp(min, n, max) {
    return Math.max(min, Math.min(n, max));
}
/**
 * @hidden
 * @param {?} obj
 * @return {?}
 */
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * @hidden
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    return JSON.stringify(a) === JSON.stringify(b);
}
/**
 * @hidden
 * @param {?} fn
 * @param {?} wait
 * @param {?=} immediate
 * @return {?}
 */
function debounce(fn, wait) {
    var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var /** @type {?} */timeout, /** @type {?} */args, /** @type {?} */context, /** @type {?} */timestamp, /** @type {?} */result;
    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var /** @type {?} */later = function later() {
            var /** @type {?} */last = Date.now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) result = fn.apply(context, args);
            }
        };
        var /** @type {?} */callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) result = fn.apply(context, args);
        return result;
    };
}
/**
 * Rewrites an absolute URL so it works across file and http based engines.
 * @param {?} url
 * @return {?}
 */
function normalizeURL(url) {
    var /** @type {?} */ionic = window['Ionic'];
    if (ionic && ionic.normalizeURL) {
        return ionic.normalizeURL(url);
    }
    return url;
}
/**
 * @hidden
 * Apply default arguments if they don't exist in
 * the first object.
 * @param {?} dest
 * @param {...?} args
 * @return {?}
 */
function defaults(dest) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    for (var /** @type {?} */i = arguments.length - 1; i >= 1; i--) {
        var /** @type {?} */source = arguments[i];
        if (source) {
            for (var /** @type {?} */key in source) {
                if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isBoolean(val) {
    return typeof val === 'boolean';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isString(val) {
    return typeof val === 'string';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isNumber(val) {
    return typeof val === 'number';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isFunction(val) {
    return typeof val === 'function';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isDefined(val) {
    return typeof val !== 'undefined';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isUndefined(val) {
    return typeof val === 'undefined';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isPresent(val) {
    return val !== undefined && val !== null;
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isBlank(val) {
    return val === undefined || val === null;
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isObject(val) {
    return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isArray(val) {
    return Array.isArray(val);
}
;
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isPrimitive(val) {
    return isString(val) || isBoolean(val) || isNumber(val) && !isNaN(val);
}
;
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isTrueProperty(val) {
    if (typeof val === 'string') {
        val = val.toLowerCase().trim();
        return val === 'true' || val === 'on' || val === '';
    }
    return !!val;
}
;
/**
 * @hidden
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function isCheckedProperty(a, b) {
    if (a === undefined || a === null || a === '') {
        return b === undefined || b === null || b === '';
    } else if (a === true || a === 'true') {
        return b === true || b === 'true';
    } else if (a === false || a === 'false') {
        return b === false || b === 'false';
    } else if (a === 0 || a === '0') {
        return b === 0 || b === '0';
    }
    // not using strict comparison on purpose
    return a == b; // tslint:disable-line
}
;
/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param {?} side the side
 * @param {?} isRTL whether the application dir is rtl
 * @param {?=} defaultRight whether the default side is right
 * @return {?}
 */
function isRightSide(side, isRTL) {
    var defaultRight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    switch (side) {
        case 'right':
            return true;
        case 'left':
            return false;
        case 'end':
            return !isRTL;
        case 'start':
            return isRTL;
        default:
            return defaultRight ? !isRTL : isRTL;
    }
}
/**
 * @hidden
 * @param {?} array
 * @param {?} indexes
 * @return {?}
 */
function reorderArray(array, indexes) {
    var /** @type {?} */element = array[indexes.from];
    array.splice(indexes.from, 1);
    array.splice(indexes.to, 0, element);
    return array;
}
/**
 * @hidden
 * @param {?} array
 * @param {?} item
 * @return {?}
 */
function removeArrayItem(array, item) {
    var /** @type {?} */index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}
/**
 * @hidden
 * @param {?} isResetDirection
 * @param {?} isMovingFast
 * @param {?} isOnResetZone
 * @return {?}
 */
function swipeShouldReset(isResetDirection, isMovingFast, isOnResetZone) {
    // The logic required to know when the sliding item should close (openAmount=0)
    // depends on three booleans (isCloseDirection, isMovingFast, isOnCloseZone)
    // and it ended up being too complicated to be written manually without errors
    // so the truth table is attached below: (0=false, 1=true)
    // isCloseDirection | isMovingFast | isOnCloseZone || shouldClose
    //         0        |       0      |       0       ||    0
    //         0        |       0      |       1       ||    1
    //         0        |       1      |       0       ||    0
    //         0        |       1      |       1       ||    0
    //         1        |       0      |       0       ||    0
    //         1        |       0      |       1       ||    1
    //         1        |       1      |       0       ||    1
    //         1        |       1      |       1       ||    1
    // The resulting expression was generated by resolving the K-map (Karnaugh map):
    var /** @type {?} */shouldClose = !isMovingFast && isOnResetZone || isResetDirection && isMovingFast;
    return shouldClose;
}
/**
 * @hidden
 */
var ASSERT_ENABLED = true;
/**
 * @hidden
 * @param {?} fn
 * @return {?}
 */
function _runInDev(fn) {
    if (ASSERT_ENABLED === true) {
        return fn();
    }
}
/**
 * @hidden
 * @param {?} actual
 * @param {?} reason
 * @return {?}
 */
function _assert(actual, reason) {
    if (!actual && ASSERT_ENABLED === true) {
        var /** @type {?} */message = 'IONIC ASSERT: ' + reason;
        console.error(message);
        debugger; // tslint:disable-line
        throw new Error(message);
    }
}
/**
 * @hidden
 * @param {?} functionToLazy
 * @return {?}
 */
function requestIonicCallback(functionToLazy) {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(functionToLazy);
    } else {
        return setTimeout(functionToLazy, 500);
    }
}
/** @hidden */
exports.assert = _assert;
/** @hidden */

exports.runInDev = _runInDev;
//# sourceMappingURL=util.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Animation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @hidden
 */
var Animation = exports.Animation = function () {
    /**
     * @param {?} plt
     * @param {?=} ele
     * @param {?=} opts
     */
    function Animation(plt, ele, opts) {
        _classCallCheck(this, Animation);

        this._dur = null;
        this._es = null;
        this._rvEs = null;
        this.hasChildren = false;
        this.isPlaying = false;
        this.hasCompleted = false;
        this.plt = plt;
        this.element(ele);
        this.opts = opts;
    }
    /**
     * @param {?} ele
     * @return {?}
     */


    _createClass(Animation, [{
        key: 'element',
        value: function element(ele) {
            if (ele) {
                if (typeof ele === 'string') {
                    ele = this.plt.doc().querySelectorAll(ele);
                    for (var /** @type {?} */i = 0; i < ele.length; i++) {
                        this._addEle(ele[i]);
                    }
                } else if (ele.length) {
                    for (var /** @type {?} */i = 0; i < ele.length; i++) {
                        this._addEle(ele[i]);
                    }
                } else {
                    this._addEle(ele);
                }
            }
            return this;
        }
        /**
         * NO DOM
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: '_addEle',
        value: function _addEle(ele) {
            if (ele.nativeElement) {
                ele = ele.nativeElement;
            }
            if (ele.nodeType === 1) {
                this._eL = (this._e = this._e || []).push(ele);
            }
        }
        /**
         * Add a child animation to this animation.
         * @param {?} childAnimation
         * @return {?}
         */

    }, {
        key: 'add',
        value: function add(childAnimation) {
            childAnimation.parent = this;
            this.hasChildren = true;
            this._cL = (this._c = this._c || []).push(childAnimation);
            return this;
        }
        /**
         * Get the duration of this animation. If this animation does
         * not have a duration, then it'll get the duration from its parent.
         * @param {?=} opts
         * @return {?}
         */

    }, {
        key: 'getDuration',
        value: function getDuration(opts) {
            if (opts && (0, _util.isDefined)(opts.duration)) {
                return opts.duration;
            } else if (this._dur !== null) {
                return this._dur;
            } else if (this.parent) {
                return this.parent.getDuration();
            }
            return 0;
        }
        /**
         * Returns if the animation is a root one.
         * @return {?}
         */

    }, {
        key: 'isRoot',
        value: function isRoot() {
            return !this.parent;
        }
        /**
         * Set the duration for this animation.
         * @param {?} milliseconds
         * @return {?}
         */

    }, {
        key: 'duration',
        value: function duration(milliseconds) {
            this._dur = milliseconds;
            return this;
        }
        /**
         * Get the easing of this animation. If this animation does
         * not have an easing, then it'll get the easing from its parent.
         * @return {?}
         */

    }, {
        key: 'getEasing',
        value: function getEasing() {
            if (this._rv && this._rvEs) {
                return this._rvEs;
            }
            return this._es !== null ? this._es : this.parent && this.parent.getEasing() || null;
        }
        /**
         * Set the easing for this animation.
         * @param {?} name
         * @return {?}
         */

    }, {
        key: 'easing',
        value: function easing(name) {
            this._es = name;
            return this;
        }
        /**
         * Set the easing for this reversed animation.
         * @param {?} name
         * @return {?}
         */

    }, {
        key: 'easingReverse',
        value: function easingReverse(name) {
            this._rvEs = name;
            return this;
        }
        /**
         * Add the "from" value for a specific property.
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */

    }, {
        key: 'from',
        value: function from(prop, val) {
            this._addProp('from', prop, val);
            return this;
        }
        /**
         * Add the "to" value for a specific property.
         * @param {?} prop
         * @param {?} val
         * @param {?=} clearProperyAfterTransition
         * @return {?}
         */

    }, {
        key: 'to',
        value: function to(prop, val, clearProperyAfterTransition) {
            var /** @type {?} */fx = this._addProp('to', prop, val);
            if (clearProperyAfterTransition) {
                // if this effect is a transform then clear the transform effect
                // otherwise just clear the actual property
                this.afterClearStyles([fx.trans ? this.plt.Css.transform : prop]);
            }
            return this;
        }
        /**
         * Shortcut to add both the "from" and "to" for the same property.
         * @param {?} prop
         * @param {?} fromVal
         * @param {?} toVal
         * @param {?=} clearProperyAfterTransition
         * @return {?}
         */

    }, {
        key: 'fromTo',
        value: function fromTo(prop, fromVal, toVal, clearProperyAfterTransition) {
            return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
        }
        /**
         * @hidden
         * NO DOM
         * @param {?} name
         * @return {?}
         */

    }, {
        key: '_getProp',
        value: function _getProp(name) {
            if (this._fx) {
                return this._fx.find(function (prop) {
                    return prop.name === name;
                });
            } else {
                this._fx = [];
            }
            return null;
        }
        /**
         * @param {?} state
         * @param {?} prop
         * @param {?} val
         * @return {?}
         */

    }, {
        key: '_addProp',
        value: function _addProp(state, prop, val) {
            var /** @type {?} */fxProp = this._getProp(prop);
            if (!fxProp) {
                // first time we've see this EffectProperty
                var /** @type {?} */shouldTrans = ANIMATION_TRANSFORMS[prop] === 1;
                fxProp = {
                    name: prop,
                    trans: shouldTrans,
                    // add the will-change property for transforms or opacity
                    wc: shouldTrans ? this.plt.Css.transform : prop
                };
                this._fx.push(fxProp);
            }
            // add from/to EffectState to the EffectProperty
            var /** @type {?} */fxState = {
                val: val,
                num: null,
                unit: ''
            };
            fxProp[state] = fxState;
            if (typeof val === 'string' && val.indexOf(' ') < 0) {
                var /** @type {?} */r = val.match(ANIMATION_CSS_VALUE_REGEX);
                var /** @type {?} */num = parseFloat(r[1]);
                if (!isNaN(num)) {
                    fxState.num = num;
                }
                fxState.unit = r[0] !== r[2] ? r[2] : '';
            } else if (typeof val === 'number') {
                fxState.num = val;
            }
            return fxProp;
        }
        /**
         * Add CSS class to this animation's elements
         * before the animation begins.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'beforeAddClass',
        value: function beforeAddClass(className) {
            (this._bfAdd = this._bfAdd || []).push(className);
            return this;
        }
        /**
         * Remove CSS class from this animation's elements
         * before the animation begins.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'beforeRemoveClass',
        value: function beforeRemoveClass(className) {
            (this._bfRm = this._bfRm || []).push(className);
            return this;
        }
        /**
         * Set CSS inline styles to this animation's elements
         * before the animation begins.
         * @param {?} styles
         * @return {?}
         */

    }, {
        key: 'beforeStyles',
        value: function beforeStyles(styles) {
            this._bfSty = styles;
            return this;
        }
        /**
         * Clear CSS inline styles from this animation's elements
         * before the animation begins.
         * @param {?} propertyNames
         * @return {?}
         */

    }, {
        key: 'beforeClearStyles',
        value: function beforeClearStyles(propertyNames) {
            this._bfSty = this._bfSty || {};
            for (var /** @type {?} */i = 0; i < propertyNames.length; i++) {
                this._bfSty[propertyNames[i]] = '';
            }
            return this;
        }
        /**
         * Add a function which contains DOM reads, which will run
         * before the animation begins.
         * @param {?} domReadFn
         * @return {?}
         */

    }, {
        key: 'beforeAddRead',
        value: function beforeAddRead(domReadFn) {
            (this._rdFn = this._rdFn || []).push(domReadFn);
            return this;
        }
        /**
         * Add a function which contains DOM writes, which will run
         * before the animation begins.
         * @param {?} domWriteFn
         * @return {?}
         */

    }, {
        key: 'beforeAddWrite',
        value: function beforeAddWrite(domWriteFn) {
            (this._wrFn = this._wrFn || []).push(domWriteFn);
            return this;
        }
        /**
         * Add CSS class to this animation's elements
         * after the animation finishes.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'afterAddClass',
        value: function afterAddClass(className) {
            (this._afAdd = this._afAdd || []).push(className);
            return this;
        }
        /**
         * Remove CSS class from this animation's elements
         * after the animation finishes.
         * @param {?} className
         * @return {?}
         */

    }, {
        key: 'afterRemoveClass',
        value: function afterRemoveClass(className) {
            (this._afRm = this._afRm || []).push(className);
            return this;
        }
        /**
         * Set CSS inline styles to this animation's elements
         * after the animation finishes.
         * @param {?} styles
         * @return {?}
         */

    }, {
        key: 'afterStyles',
        value: function afterStyles(styles) {
            this._afSty = styles;
            return this;
        }
        /**
         * Clear CSS inline styles from this animation's elements
         * after the animation finishes.
         * @param {?} propertyNames
         * @return {?}
         */

    }, {
        key: 'afterClearStyles',
        value: function afterClearStyles(propertyNames) {
            this._afSty = this._afSty || {};
            for (var /** @type {?} */i = 0; i < propertyNames.length; i++) {
                this._afSty[propertyNames[i]] = '';
            }
            return this;
        }
        /**
         * Play the animation.
         * @param {?=} opts
         * @return {?}
         */

    }, {
        key: 'play',
        value: function play(opts) {
            var _this = this;

            // If the animation was already invalidated (it did finish), do nothing
            if (!this.plt) {
                return;
            }
            // this is the top level animation and is in full control
            // of when the async play() should actually kick off
            // if there is no duration then it'll set the TO property immediately
            // if there is a duration, then it'll stage all animations at the
            // FROM property and transition duration, wait a few frames, then
            // kick off the animation by setting the TO property for each animation
            this._isAsync = this._hasDuration(opts);
            // ensure all past transition end events have been cleared
            this._clearAsync();
            // recursively kicks off the correct progress step for each child animation
            // ******** DOM WRITE ****************
            this._playInit(opts);
            // doubling up RAFs since this animation was probably triggered
            // from an input event, and just having one RAF would have this code
            // run within the same frame as the triggering input event, and the
            // input event probably already did way too much work for one frame
            this.plt.raf(function () {
                _this.plt.raf(_this._playDomInspect.bind(_this, opts));
            });
        }
        /**
         * @return {?}
         */

    }, {
        key: 'syncPlay',
        value: function syncPlay() {
            // If the animation was already invalidated (it did finish), do nothing
            if (!this.plt) {
                return;
            }
            var /** @type {?} */opts = { duration: 0 };
            this._isAsync = false;
            this._clearAsync();
            this._playInit(opts);
            this._playDomInspect(opts);
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_playInit',
        value: function _playInit(opts) {
            // always default that an animation does not tween
            // a tween requires that an Animation class has an element
            // and that it has at least one FROM/TO effect
            // and that the FROM/TO effect can tween numeric values
            this._twn = false;
            this.isPlaying = true;
            this.hasCompleted = false;
            this._hasDur = this.getDuration(opts) > ANIMATION_DURATION_MIN;
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playInit(opts);
            }
            if (this._hasDur) {
                // if there is a duration then we want to start at step 0
                // ******** DOM WRITE ****************
                this._progress(0);
                // add the will-change properties
                // ******** DOM WRITE ****************
                this._willChg(true);
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * ROOT ANIMATION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_playDomInspect',
        value: function _playDomInspect(opts) {
            // fire off all the "before" function that have DOM READS in them
            // elements will be in the DOM, however visibily hidden
            // so we can read their dimensions if need be
            // ******** DOM READ ****************
            // ******** DOM WRITE ****************
            this._beforeAnimation();
            // for the root animation only
            // set the async TRANSITION END event
            // and run onFinishes when the transition ends
            var /** @type {?} */dur = this.getDuration(opts);
            if (this._isAsync) {
                this._asyncEnd(dur, true);
            }
            // ******** DOM WRITE ****************
            this._playProgress(opts);
            if (this._isAsync && this.plt) {
                // this animation has a duration so we need another RAF
                // for the CSS TRANSITION properties to kick in
                this.plt.raf(this._playToStep.bind(this, 1));
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_playProgress',
        value: function _playProgress(opts) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playProgress(opts);
            }
            if (this._hasDur) {
                // set the CSS TRANSITION duration/easing
                // ******** DOM WRITE ****************
                this._setTrans(this.getDuration(opts), false);
            } else {
                // this animation does not have a duration, so it should not animate
                // just go straight to the TO properties and call it done
                // ******** DOM WRITE ****************
                this._progress(1);
                // since there was no animation, immediately run the after
                // ******** DOM WRITE ****************
                this._setAfterStyles();
                // this animation has no duration, so it has finished
                // other animations could still be running
                this._didFinish(true);
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} stepValue
         * @return {?}
         */

    }, {
        key: '_playToStep',
        value: function _playToStep(stepValue) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playToStep(stepValue);
            }
            if (this._hasDur) {
                // browser had some time to render everything in place
                // and the transition duration/easing is set
                // now set the TO properties which will trigger the transition to begin
                // ******** DOM WRITE ****************
                this._progress(stepValue);
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * ROOT ANIMATION
         * @param {?} dur
         * @param {?} shouldComplete
         * @return {?}
         */

    }, {
        key: '_asyncEnd',
        value: function _asyncEnd(dur, shouldComplete) {
            void 0;
            void 0;
            void 0;
            var /** @type {?} */self = this;
            /**
             * @return {?}
             */
            function onTransitionEnd() {
                // congrats! a successful transition completed!
                // ensure transition end events and timeouts have been cleared
                self._clearAsync();
                // ******** DOM WRITE ****************
                self._playEnd();
                // transition finished
                self._didFinishAll(shouldComplete, true, false);
            }
            /**
             * @return {?}
             */
            function onTransitionFallback() {
                void 0;
                // oh noz! the transition end event didn't fire in time!
                // instead the fallback timer when first
                // if all goes well this fallback should never fire
                // clear the other async end events from firing
                self._tm = undefined;
                self._clearAsync();
                // set the after styles
                // ******** DOM WRITE ****************
                self._playEnd(shouldComplete ? 1 : 0);
                // transition finished
                self._didFinishAll(shouldComplete, true, false);
            }
            // set the TRANSITION END event on one of the transition elements
            self._unrgTrns = this.plt.transitionEnd(self._transEl(), onTransitionEnd, false);
            // set a fallback timeout if the transition end event never fires, or is too slow
            // transition end fallback: (animation duration + XXms)
            self._tm = self.plt.timeout(onTransitionFallback, dur + ANIMATION_TRANSITION_END_FALLBACK_PADDING_MS);
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?=} stepValue
         * @return {?}
         */

    }, {
        key: '_playEnd',
        value: function _playEnd(stepValue) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._playEnd(stepValue);
            }
            if (this._hasDur) {
                if ((0, _util.isDefined)(stepValue)) {
                    // too late to have a smooth animation, just finish it
                    // ******** DOM WRITE ****************
                    this._setTrans(0, true);
                    // ensure the ending progress step gets rendered
                    // ******** DOM WRITE ****************
                    this._progress(stepValue);
                }
                // set the after styles
                // ******** DOM WRITE ****************
                this._setAfterStyles();
                // remove the will-change properties
                // ******** DOM WRITE ****************
                this._willChg(false);
            }
        }
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @param {?} opts
         * @return {?}
         */

    }, {
        key: '_hasDuration',
        value: function _hasDuration(opts) {
            if (this.getDuration(opts) > ANIMATION_DURATION_MIN) {
                return true;
            }
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                if (children[i]._hasDuration(opts)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_hasDomReads',
        value: function _hasDomReads() {
            if (this._rdFn && this._rdFn.length) {
                return true;
            }
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                if (children[i]._hasDomReads()) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Immediately stop at the end of the animation.
         * @param {?=} stepValue
         * @return {?}
         */

    }, {
        key: 'stop',
        value: function stop() {
            var stepValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            // ensure all past transition end events have been cleared
            this._clearAsync();
            this._hasDur = true;
            this._playEnd(stepValue);
        }
        /**
         * @hidden
         * NO DOM
         * NO RECURSION
         * @return {?}
         */

    }, {
        key: '_clearAsync',
        value: function _clearAsync() {
            this._unrgTrns && this._unrgTrns();
            this._tm && clearTimeout(this._tm);
            this._tm = this._unrgTrns = undefined;
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} stepValue
         * @return {?}
         */

    }, {
        key: '_progress',
        value: function _progress(stepValue) {
            // bread 'n butter
            var /** @type {?} */val = void 0;
            var /** @type {?} */effects = this._fx;
            var /** @type {?} */nuElements = this._eL;
            if (!effects || !nuElements) {
                return;
            }
            // flip the number if we're going in reverse
            if (this._rv) {
                stepValue = stepValue * -1 + 1;
            }
            var /** @type {?} */i, /** @type {?} */j;
            var /** @type {?} */finalTransform = '';
            var /** @type {?} */elements = this._e;
            for (i = 0; i < effects.length; i++) {
                var /** @type {?} */fx = effects[i];
                if (fx.from && fx.to) {
                    var /** @type {?} */fromNum = fx.from.num;
                    var /** @type {?} */toNum = fx.to.num;
                    var /** @type {?} */tweenEffect = fromNum !== toNum;
                    void 0;
                    if (tweenEffect) {
                        this._twn = true;
                    }
                    if (stepValue === 0) {
                        // FROM
                        val = fx.from.val;
                    } else if (stepValue === 1) {
                        // TO
                        val = fx.to.val;
                    } else if (tweenEffect) {
                        // EVERYTHING IN BETWEEN
                        var /** @type {?} */valNum = (toNum - fromNum) * stepValue + fromNum;
                        var /** @type {?} */unit = fx.to.unit;
                        if (unit === 'px') {
                            valNum = Math.round(valNum);
                        }
                        val = valNum + unit;
                    }
                    if (val !== null) {
                        var /** @type {?} */prop = fx.name;
                        if (fx.trans) {
                            finalTransform += prop + '(' + val + ') ';
                        } else {
                            for (j = 0; j < nuElements; j++) {
                                // ******** DOM WRITE ****************
                                elements[j].style[prop] = val;
                            }
                        }
                    }
                }
            }
            // place all transforms on the same property
            if (finalTransform.length) {
                if (!this._rv && stepValue !== 1 || this._rv && stepValue !== 0) {
                    finalTransform += 'translateZ(0px)';
                }
                var /** @type {?} */cssTransform = this.plt.Css.transform;
                for (i = 0; i < elements.length; i++) {
                    // ******** DOM WRITE ****************
                    elements[i].style[cssTransform] = finalTransform;
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} dur
         * @param {?} forcedLinearEasing
         * @return {?}
         */

    }, {
        key: '_setTrans',
        value: function _setTrans(dur, forcedLinearEasing) {
            // Transition is not enabled if there are not effects
            if (!this._fx) {
                return;
            }
            // set the TRANSITION properties inline on the element
            var /** @type {?} */elements = this._e;
            var /** @type {?} */easing = forcedLinearEasing ? 'linear' : this.getEasing();
            var /** @type {?} */durString = dur + 'ms';
            var /** @type {?} */Css = this.plt.Css;
            var /** @type {?} */cssTransform = Css.transition;
            var /** @type {?} */cssTransitionDuration = Css.transitionDuration;
            var /** @type {?} */cssTransitionTimingFn = Css.transitionTimingFn;
            var /** @type {?} */eleStyle = void 0;
            for (var /** @type {?} */i = 0; i < this._eL; i++) {
                eleStyle = elements[i].style;
                if (dur > 0) {
                    // ******** DOM WRITE ****************
                    eleStyle[cssTransform] = '';
                    eleStyle[cssTransitionDuration] = durString;
                    // each animation can have a different easing
                    if (easing) {
                        // ******** DOM WRITE ****************
                        eleStyle[cssTransitionTimingFn] = easing;
                    }
                } else {
                    eleStyle[cssTransform] = 'none';
                }
            }
        }
        /**
         * @hidden
         * DOM READ
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_beforeAnimation',
        value: function _beforeAnimation() {
            // fire off all the "before" function that have DOM READS in them
            // elements will be in the DOM, however visibily hidden
            // so we can read their dimensions if need be
            // ******** DOM READ ****************
            this._fireBeforeReadFunc();
            // ******** DOM READS ABOVE / DOM WRITES BELOW ****************
            // fire off all the "before" function that have DOM WRITES in them
            // ******** DOM WRITE ****************
            this._fireBeforeWriteFunc();
            // stage all of the before css classes and inline styles
            // ******** DOM WRITE ****************
            this._setBeforeStyles();
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_setBeforeStyles',
        value: function _setBeforeStyles() {
            var /** @type {?} */i = void 0,
                /** @type {?} */j = void 0;
            var /** @type {?} */children = this._c;
            for (i = 0; i < this._cL; i++) {
                children[i]._setBeforeStyles();
            }
            // before the animations have started
            // only set before styles if animation is not reversed
            if (this._rv) {
                return;
            }
            var /** @type {?} */addClasses = this._bfAdd;
            var /** @type {?} */removeClasses = this._bfRm;
            var /** @type {?} */ele = void 0;
            var /** @type {?} */eleClassList = void 0;
            var /** @type {?} */prop = void 0;
            for (i = 0; i < this._eL; i++) {
                ele = this._e[i];
                eleClassList = ele.classList;
                // css classes to add before the animation
                if (addClasses) {
                    for (j = 0; j < addClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        eleClassList.add(addClasses[j]);
                    }
                }
                // css classes to remove before the animation
                if (removeClasses) {
                    for (j = 0; j < removeClasses.length; j++) {
                        // ******** DOM WRITE ****************
                        eleClassList.remove(removeClasses[j]);
                    }
                }
                // inline styles to add before the animation
                if (this._bfSty) {
                    for (prop in this._bfSty) {
                        // ******** DOM WRITE ****************
                        ele.style[prop] = this._bfSty[prop];
                    }
                }
            }
        }
        /**
         * @hidden
         * DOM READ
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_fireBeforeReadFunc',
        value: function _fireBeforeReadFunc() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM READ ****************
                children[i]._fireBeforeReadFunc();
            }
            var /** @type {?} */readFunctions = this._rdFn;
            if (readFunctions) {
                for (var /** @type {?} */i = 0; i < readFunctions.length; i++) {
                    // ******** DOM READ ****************
                    readFunctions[i]();
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_fireBeforeWriteFunc',
        value: function _fireBeforeWriteFunc() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._fireBeforeWriteFunc();
            }
            var /** @type {?} */writeFunctions = this._wrFn;
            if (this._wrFn) {
                for (var /** @type {?} */i = 0; i < writeFunctions.length; i++) {
                    // ******** DOM WRITE ****************
                    writeFunctions[i]();
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * @return {?}
         */

    }, {
        key: '_setAfterStyles',
        value: function _setAfterStyles() {
            var /** @type {?} */i = void 0,
                /** @type {?} */j = void 0;
            var /** @type {?} */ele = void 0;
            var /** @type {?} */eleClassList = void 0;
            var /** @type {?} */elements = this._e;
            for (i = 0; i < this._eL; i++) {
                ele = elements[i];
                eleClassList = ele.classList;
                // remove the transition duration/easing
                // ******** DOM WRITE ****************
                ele.style[this.plt.Css.transitionDuration] = ele.style[this.plt.Css.transitionTimingFn] = '';
                if (this._rv) {
                    // finished in reverse direction
                    // css classes that were added before the animation should be removed
                    if (this._bfAdd) {
                        for (j = 0; j < this._bfAdd.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.remove(this._bfAdd[j]);
                        }
                    }
                    // css classes that were removed before the animation should be added
                    if (this._bfRm) {
                        for (j = 0; j < this._bfRm.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.add(this._bfRm[j]);
                        }
                    }
                    // inline styles that were added before the animation should be removed
                    if (this._bfSty) {
                        for (var /** @type {?} */prop in this._bfSty) {
                            // ******** DOM WRITE ****************
                            ele.style[prop] = '';
                        }
                    }
                } else {
                    // finished in forward direction
                    // css classes to add after the animation
                    if (this._afAdd) {
                        for (j = 0; j < this._afAdd.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.add(this._afAdd[j]);
                        }
                    }
                    // css classes to remove after the animation
                    if (this._afRm) {
                        for (j = 0; j < this._afRm.length; j++) {
                            // ******** DOM WRITE ****************
                            eleClassList.remove(this._afRm[j]);
                        }
                    }
                    // inline styles to add after the animation
                    if (this._afSty) {
                        for (var /** @type {?} */prop in this._afSty) {
                            // ******** DOM WRITE ****************
                            ele.style[prop] = this._afSty[prop];
                        }
                    }
                }
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * NO RECURSION
         * @param {?} addWillChange
         * @return {?}
         */

    }, {
        key: '_willChg',
        value: function _willChg(addWillChange) {
            var /** @type {?} */wc = void 0;
            var /** @type {?} */effects = this._fx;
            var /** @type {?} */willChange = void 0;
            if (addWillChange && effects) {
                wc = [];
                for (var /** @type {?} */i = 0; i < effects.length; i++) {
                    var /** @type {?} */propWC = effects[i].wc;
                    if (propWC === 'webkitTransform') {
                        wc.push('transform', '-webkit-transform');
                    } else {
                        wc.push(propWC);
                    }
                }
                willChange = wc.join(',');
            } else {
                willChange = '';
            }
            for (var /** @type {?} */i = 0; i < this._eL; i++) {
                // ******** DOM WRITE ****************
                this._e[i].style.willChange = willChange;
            }
        }
        /**
         * Start the animation with a user controlled progress.
         * @return {?}
         */

    }, {
        key: 'progressStart',
        value: function progressStart() {
            // ensure all past transition end events have been cleared
            this._clearAsync();
            // ******** DOM READ/WRITE ****************
            this._beforeAnimation();
            // ******** DOM WRITE ****************
            this._progressStart();
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @return {?}
         */

    }, {
        key: '_progressStart',
        value: function _progressStart() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._progressStart();
            }
            // force no duration, linear easing
            // ******** DOM WRITE ****************
            this._setTrans(0, true);
            // ******** DOM WRITE ****************
            this._willChg(true);
        }
        /**
         * Set the progress step for this animation.
         * progressStep() is not debounced, so it should not be called faster than 60FPS.
         * @param {?} stepValue
         * @return {?}
         */

    }, {
        key: 'progressStep',
        value: function progressStep(stepValue) {
            // only update if the last update was more than 16ms ago
            stepValue = Math.min(1, Math.max(0, stepValue));
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i].progressStep(stepValue);
            }
            if (this._rv) {
                // if the animation is going in reverse then
                // flip the step value: 0 becomes 1, 1 becomes 0
                stepValue = stepValue * -1 + 1;
            }
            // ******** DOM WRITE ****************
            this._progress(stepValue);
        }
        /**
         * End the progress animation.
         * @param {?} shouldComplete
         * @param {?} currentStepValue
         * @param {?=} dur
         * @return {?}
         */

    }, {
        key: 'progressEnd',
        value: function progressEnd(shouldComplete, currentStepValue) {
            var dur = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

            void 0;
            if (this._rv) {
                // if the animation is going in reverse then
                // flip the step value: 0 becomes 1, 1 becomes 0
                currentStepValue = currentStepValue * -1 + 1;
            }
            var /** @type {?} */stepValue = shouldComplete ? 1 : 0;
            var /** @type {?} */diff = Math.abs(currentStepValue - stepValue);
            if (diff < 0.05) {
                dur = 0;
            } else if (dur < 0) {
                dur = this._dur;
            }
            this._isAsync = dur > 30;
            this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);
            if (this._isAsync) {
                // for the root animation only
                // set the async TRANSITION END event
                // and run onFinishes when the transition ends
                // ******** DOM WRITE ****************
                this._asyncEnd(dur, shouldComplete);
                // this animation has a duration so we need another RAF
                // for the CSS TRANSITION properties to kick in
                this.plt && this.plt.raf(this._playToStep.bind(this, stepValue));
            }
        }
        /**
         * @hidden
         * DOM WRITE
         * RECURSION
         * @param {?} shouldComplete
         * @param {?} stepValue
         * @param {?} dur
         * @param {?} isAsync
         * @return {?}
         */

    }, {
        key: '_progressEnd',
        value: function _progressEnd(shouldComplete, stepValue, dur, isAsync) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                // ******** DOM WRITE ****************
                children[i]._progressEnd(shouldComplete, stepValue, dur, isAsync);
            }
            if (!isAsync) {
                // stop immediately
                // set all the animations to their final position
                // ******** DOM WRITE ****************
                this._progress(stepValue);
                this._willChg(false);
                this._setAfterStyles();
                this._didFinish(shouldComplete);
            } else {
                // animate it back to it's ending position
                this.isPlaying = true;
                this.hasCompleted = false;
                this._hasDur = true;
                // ******** DOM WRITE ****************
                this._willChg(true);
                this._setTrans(dur, false);
            }
        }
        /**
         * Add a callback to fire when the animation has finished.
         * @param {?} callback
         * @param {?=} onceTimeCallback
         * @param {?=} clearOnFinishCallacks
         * @return {?}
         */

    }, {
        key: 'onFinish',
        value: function onFinish(callback) {
            var onceTimeCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var clearOnFinishCallacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (clearOnFinishCallacks) {
                this._fFn = this._fOneFn = undefined;
            }
            if (onceTimeCallback) {
                this._fOneFn = this._fOneFn || [];
                this._fOneFn.push(callback);
            } else {
                this._fFn = this._fFn || [];
                this._fFn.push(callback);
            }
            return this;
        }
        /**
         * @hidden
         * NO DOM
         * RECURSION
         * @param {?} hasCompleted
         * @param {?} finishAsyncAnimations
         * @param {?} finishNoDurationAnimations
         * @return {?}
         */

    }, {
        key: '_didFinishAll',
        value: function _didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations) {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                children[i]._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
            }
            if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
                this._didFinish(hasCompleted);
            }
        }
        /**
         * @hidden
         * NO RECURSION
         * @param {?} hasCompleted
         * @return {?}
         */

    }, {
        key: '_didFinish',
        value: function _didFinish(hasCompleted) {
            this.isPlaying = false;
            this.hasCompleted = hasCompleted;
            if (this._fFn) {
                // run all finish callbacks
                for (var /** @type {?} */i = 0; i < this._fFn.length; i++) {
                    this._fFn[i](this);
                }
            }
            if (this._fOneFn) {
                // run all "onetime" finish callbacks
                for (var /** @type {?} */i = 0; i < this._fOneFn.length; i++) {
                    this._fOneFn[i](this);
                }
                this._fOneFn.length = 0;
            }
        }
        /**
         * Reverse the animation.
         * @param {?=} shouldReverse
         * @return {?}
         */

    }, {
        key: 'reverse',
        value: function reverse() {
            var shouldReverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                children[i].reverse(shouldReverse);
            }
            this._rv = shouldReverse;
            return this;
        }
        /**
         * Recursively destroy this animation and all child animations.
         * @return {?}
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            var /** @type {?} */children = this._c;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                children[i].destroy();
            }
            this._clearAsync();
            this.parent = this.plt = this._e = this._rdFn = this._wrFn = null;
            if (this._c) {
                this._c.length = this._cL = 0;
            }
            if (this._fFn) {
                this._fFn.length = 0;
            }
            if (this._fOneFn) {
                this._fOneFn.length = 0;
            }
        }
        /**
         * @hidden
         * NO DOM
         * @return {?}
         */

    }, {
        key: '_transEl',
        value: function _transEl() {
            // get the lowest level element that has an Animation
            var /** @type {?} */targetEl;
            for (var /** @type {?} */i = 0; i < this._cL; i++) {
                targetEl = this._c[i]._transEl();
                if (targetEl) {
                    return targetEl;
                }
            }
            return this._twn && this._hasDur && this._eL ? this._e[0] : null;
        }
    }]);

    return Animation;
}();

function Animation_tsickle_Closure_declarations() {
    /** @type {?} */
    Animation.prototype._c;
    /** @type {?} */
    Animation.prototype._cL;
    /** @type {?} */
    Animation.prototype._e;
    /** @type {?} */
    Animation.prototype._eL;
    /** @type {?} */
    Animation.prototype._fx;
    /** @type {?} */
    Animation.prototype._dur;
    /** @type {?} */
    Animation.prototype._es;
    /** @type {?} */
    Animation.prototype._rvEs;
    /** @type {?} */
    Animation.prototype._bfSty;
    /** @type {?} */
    Animation.prototype._bfAdd;
    /** @type {?} */
    Animation.prototype._bfRm;
    /** @type {?} */
    Animation.prototype._afSty;
    /** @type {?} */
    Animation.prototype._afAdd;
    /** @type {?} */
    Animation.prototype._afRm;
    /** @type {?} */
    Animation.prototype._rdFn;
    /** @type {?} */
    Animation.prototype._wrFn;
    /** @type {?} */
    Animation.prototype._fFn;
    /** @type {?} */
    Animation.prototype._fOneFn;
    /** @type {?} */
    Animation.prototype._rv;
    /** @type {?} */
    Animation.prototype._unrgTrns;
    /** @type {?} */
    Animation.prototype._tm;
    /** @type {?} */
    Animation.prototype._hasDur;
    /** @type {?} */
    Animation.prototype._isAsync;
    /** @type {?} */
    Animation.prototype._twn;
    /** @type {?} */
    Animation.prototype.plt;
    /** @type {?} */
    Animation.prototype.parent;
    /** @type {?} */
    Animation.prototype.opts;
    /** @type {?} */
    Animation.prototype.hasChildren;
    /** @type {?} */
    Animation.prototype.isPlaying;
    /** @type {?} */
    Animation.prototype.hasCompleted;
}
var /** @type {?} */ANIMATION_TRANSFORMS = {
    'translateX': 1,
    'translateY': 1,
    'translateZ': 1,
    'scale': 1,
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'rotate': 1,
    'rotateX': 1,
    'rotateY': 1,
    'rotateZ': 1,
    'skewX': 1,
    'skewY': 1,
    'perspective': 1
};
var /** @type {?} */ANIMATION_CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
var /** @type {?} */ANIMATION_DURATION_MIN = 32;
var /** @type {?} */ANIMATION_TRANSITION_END_FALLBACK_PADDING_MS = 400;
//# sourceMappingURL=animation.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomController = exports.DomDebouncer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Adopted from FastDom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://github.com/wilsonpage/fastdom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * MIT License
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _core = require('@angular/core');

var _platform = require('./platform');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @hidden
 */
var DomDebouncer = exports.DomDebouncer = function () {
    /**
     * @param {?} dom
     */
    function DomDebouncer(dom) {
        _classCallCheck(this, DomDebouncer);

        this.dom = dom;
        this.writeTask = null;
        this.readTask = null;
    }
    /**
     * @param {?} fn
     * @return {?}
     */


    _createClass(DomDebouncer, [{
        key: 'read',
        value: function read(fn) {
            var _this = this;

            if (this.readTask) {
                return;
            }
            return this.readTask = this.dom.read(function (t) {
                _this.readTask = null;
                fn(t);
            });
        }
        /**
         * @param {?} fn
         * @param {?=} ctx
         * @return {?}
         */

    }, {
        key: 'write',
        value: function write(fn, ctx) {
            var _this2 = this;

            if (this.writeTask) {
                return;
            }
            return this.writeTask = this.dom.write(function (t) {
                _this2.writeTask = null;
                fn(t);
            });
        }
        /**
         * @return {?}
         */

    }, {
        key: 'cancel',
        value: function cancel() {
            var /** @type {?} */writeTask = this.writeTask;
            writeTask && this.dom.cancel(writeTask);
            var /** @type {?} */readTask = this.readTask;
            readTask && this.dom.cancel(readTask);
            this.readTask = this.writeTask = null;
        }
    }]);

    return DomDebouncer;
}();

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

var DomController = exports.DomController = function () {
    /**
     * @param {?} plt
     */
    function DomController(plt) {
        _classCallCheck(this, DomController);

        this.plt = plt;
        this.r = [];
        this.w = [];
    }
    /**
     * @return {?}
     */


    _createClass(DomController, [{
        key: 'debouncer',
        value: function debouncer() {
            return new DomDebouncer(this);
        }
        /**
         * @param {?} fn
         * @param {?=} timeout
         * @return {?}
         */

    }, {
        key: 'read',
        value: function read(fn, timeout) {
            var _this3 = this;

            if (timeout) {
                fn.timeoutId = this.plt.timeout(function () {
                    _this3.r.push(fn);
                    _this3._queue();
                }, timeout);
            } else {
                this.r.push(fn);
                this._queue();
            }
            return fn;
        }
        /**
         * @param {?} fn
         * @param {?=} timeout
         * @return {?}
         */

    }, {
        key: 'write',
        value: function write(fn, timeout) {
            var _this4 = this;

            if (timeout) {
                fn.timeoutId = this.plt.timeout(function () {
                    _this4.w.push(fn);
                    _this4._queue();
                }, timeout);
            } else {
                this.w.push(fn);
                this._queue();
            }
            return fn;
        }
        /**
         * @param {?} fn
         * @return {?}
         */

    }, {
        key: 'cancel',
        value: function cancel(fn) {
            if (fn) {
                if (fn.timeoutId) {
                    this.plt.cancelTimeout(fn.timeoutId);
                }
                (0, _util.removeArrayItem)(this.r, fn) || (0, _util.removeArrayItem)(this.w, fn);
            }
        }
        /**
         * @return {?}
         */

    }, {
        key: '_queue',
        value: function _queue() {
            var /** @type {?} */self = this;
            if (!self.q) {
                self.q = true;
                self.plt.raf(function rafCallback(timeStamp) {
                    self._flush(timeStamp);
                });
            }
        }
        /**
         * @param {?} timeStamp
         * @return {?}
         */

    }, {
        key: '_flush',
        value: function _flush(timeStamp) {
            var /** @type {?} */err = void 0;
            try {
                dispatch(timeStamp, this.r, this.w);
            } catch (e) {
                err = e;
            }
            this.q = false;
            if (this.r.length || this.w.length) {
                this._queue();
            }
            if (err) {
                throw err;
            }
        }
    }]);

    return DomController;
}();

DomController.decorators = [{ type: _core.Injectable }];
/**
 * @nocollapse
 */
DomController.ctorParameters = function () {
    return [{ type: _platform.Platform }];
};
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
    var /** @type {?} */fn = void 0;
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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCss = getCss;
exports.pointerCoord = pointerCoord;
exports.hasPointerMoved = hasPointerMoved;
exports.isTextInput = isTextInput;
exports.copyInputAttributes = copyInputAttributes;
/**
 * @param {?} docEle
 * @return {?}
 */
function getCss(docEle) {
    var /** @type {?} */css = {};
    // transform
    var /** @type {?} */i;
    var /** @type {?} */keys = ['webkitTransform', '-webkit-transform', 'webkit-transform', 'transform'];
    for (i = 0; i < keys.length; i++) {
        if (docEle.style[keys[i]] !== undefined) {
            css.transform = keys[i];
            break;
        }
    }
    // transition
    keys = ['webkitTransition', 'transition'];
    for (i = 0; i < keys.length; i++) {
        if (docEle.style[keys[i]] !== undefined) {
            css.transition = keys[i];
            break;
        }
    }
    // The only prefix we care about is webkit for transitions.
    var /** @type {?} */isWebkit = css.transition.indexOf('webkit') > -1;
    // transition duration
    css.transitionDuration = (isWebkit ? '-webkit-' : '') + 'transition-duration';
    // transition timing function
    css.transitionTimingFn = (isWebkit ? '-webkit-' : '') + 'transition-timing-function';
    // transition delay
    css.transitionDelay = (isWebkit ? '-webkit-' : '') + 'transition-delay';
    // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
    css.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
    // transform origin
    css.transformOrigin = (isWebkit ? '-webkit-' : '') + 'transform-origin';
    // animation delay
    css.animationDelay = isWebkit ? 'webkitAnimationDelay' : 'animationDelay';
    return css;
}
/**
 * @param {?} ev
 * @return {?}
 */
function pointerCoord(ev) {
    // get coordinates for either a mouse click
    // or a touch depending on the given event
    if (ev) {
        var /** @type {?} */changedTouches = ev.changedTouches;
        if (changedTouches && changedTouches.length > 0) {
            var /** @type {?} */touch = changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
        }
        var /** @type {?} */pageX = ev.pageX;
        if (pageX !== undefined) {
            return { x: pageX, y: ev.pageY };
        }
    }
    return { x: 0, y: 0 };
}
/**
 * @param {?} threshold
 * @param {?} startCoord
 * @param {?} endCoord
 * @return {?}
 */
function hasPointerMoved(threshold, startCoord, endCoord) {
    if (startCoord && endCoord) {
        var /** @type {?} */deltaX = startCoord.x - endCoord.x;
        var /** @type {?} */deltaY = startCoord.y - endCoord.y;
        var /** @type {?} */distance = deltaX * deltaX + deltaY * deltaY;
        return distance > threshold * threshold;
    }
    return false;
}
/**
 * @param {?} ele
 * @return {?}
 */
function isTextInput(ele) {
    return !!ele && (ele.tagName === 'TEXTAREA' || ele.contentEditable === 'true' || ele.tagName === 'INPUT' && !NON_TEXT_INPUT_REGEX.test(ele.type));
}
var /** @type {?} */NON_TEXT_INPUT_REGEX = exports.NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;
var /** @type {?} */skipInputAttrsReg = /^(value|checked|disabled|type|class|style|id|autofocus|autocomplete|autocorrect)$/i;
/**
 * @param {?} srcElement
 * @param {?} destElement
 * @return {?}
 */
function copyInputAttributes(srcElement, destElement) {
    // copy attributes from one element to another
    // however, skip over a few of them as they're already
    // handled in the angular world
    var /** @type {?} */attrs = srcElement.attributes;
    for (var /** @type {?} */i = 0; i < attrs.length; i++) {
        var /** @type {?} */attr = attrs[i];
        if (!skipInputAttrsReg.test(attr.name)) {
            destElement.setAttribute(attr.name, attr.value);
        }
    }
}
//# sourceMappingURL=dom.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlatformConfigToken = exports.PLATFORM_CONFIGS = undefined;
exports.providePlatformConfigs = providePlatformConfigs;

var _core = require('@angular/core');

var _platformUtils = require('./platform-utils');

var /** @type {?} */PLATFORM_CONFIGS = exports.PLATFORM_CONFIGS = {
    /**
     * core
     */
    'core': {
        settings: {
            mode: 'md',
            keyboardHeight: 290
        }
    },
    /**
     * mobile
     */
    'mobile': {},
    /**
     * phablet
     */
    'phablet': {
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            var /** @type {?} */smallest = Math.min(plt.width(), plt.height());
            var /** @type {?} */largest = Math.max(plt.width(), plt.height());
            return smallest > 390 && smallest < 520 && largest > 620 && largest < 800;
        }
    },
    /**
     * tablet
     */
    'tablet': {
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            var /** @type {?} */smallest = Math.min(plt.width(), plt.height());
            var /** @type {?} */largest = Math.max(plt.width(), plt.height());
            return smallest > 460 && smallest < 820 && largest > 780 && largest < 1400;
        }
    },
    /**
     * android
     */
    'android': {
        superset: 'mobile',
        subsets: ['phablet', 'tablet'],
        settings: {
            activator: function activator(plt) {
                // md mode defaults to use ripple activator
                // however, under-powered devices shouldn't use ripple
                // if this a linux device, and is using Android Chrome v36 (Android 5.0)
                // or above then use ripple, otherwise do not use a ripple effect
                if (plt.testNavigatorPlatform('linux')) {
                    var /** @type {?} */chromeVersion = plt.matchUserAgentVersion(/Chrome\/(\d+).(\d+)?/);
                    if (chromeVersion) {
                        // linux android device using modern android chrome browser gets ripple
                        if (parseInt(chromeVersion.major, 10) < 36 || plt.version().major < 5) {
                            return 'none';
                        } else {
                            return 'ripple';
                        }
                    }
                    // linux android device not using chrome browser checks just android's version
                    if (plt.version().major < 5) {
                        return 'none';
                    }
                }
                // fallback to always use ripple
                return 'ripple';
            },
            autoFocusAssist: 'immediate',
            inputCloning: true,
            scrollAssist: true,
            hoverCSS: false,
            keyboardHeight: 300,
            mode: 'md'
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('android', ['android', 'silk'], ['windows phone']);
        },

        /**
         * @param {?} plt
         * @return {?}
         */
        versionParser: function versionParser(plt) {
            return plt.matchUserAgentVersion(/Android (\d+).(\d+)?/);
        }
    },
    /**
     * ios
     */
    'ios': {
        superset: 'mobile',
        subsets: ['ipad', 'iphone'],
        settings: {
            autoFocusAssist: 'delay',
            hoverCSS: false,
            inputBlurring: _platformUtils.isIos,
            inputCloning: _platformUtils.isIos,
            keyboardHeight: 300,
            mode: 'ios',
            scrollAssist: _platformUtils.isIos,
            statusbarPadding: _platformUtils.isCordova,
            swipeBackEnabled: _platformUtils.isIos,
            tapPolyfill: _platformUtils.isIosUIWebView,
            virtualScrollEventAssist: _platformUtils.isIosUIWebView,
            disableScrollAssist: _platformUtils.isIos
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('ios', ['iphone', 'ipad', 'ipod'], ['windows phone']);
        },

        /**
         * @param {?} plt
         * @return {?}
         */
        versionParser: function versionParser(plt) {
            return plt.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
        }
    },
    /**
     * ipad
     */
    'ipad': {
        superset: 'tablet',
        settings: {
            keyboardHeight: 500
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('ipad');
        }
    },
    /**
     * iphone
     */
    'iphone': {
        subsets: ['phablet'],
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('iphone');
        }
    },
    /**
     * Windows
     */
    'windows': {
        superset: 'mobile',
        subsets: ['phablet', 'tablet'],
        settings: {
            mode: 'wp',
            autoFocusAssist: 'immediate',
            hoverCSS: false
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return plt.isPlatformMatch('windows', ['windows phone']);
        },

        /**
         * @param {?} plt
         * @return {?}
         */
        versionParser: function versionParser(plt) {
            return plt.matchUserAgentVersion(/Windows Phone (\d+).(\d+)?/);
        }
    },
    /**
     * cordova
     */
    'cordova': {
        isEngine: true,
        initialize: function initialize(plt) {
            // prepare a custom "ready" for cordova "deviceready"
            plt.prepareReady = function () {
                // 1) ionic bootstrapped
                plt.windowLoad(function (win, doc) {
                    // 2) window onload triggered or completed
                    doc.addEventListener('deviceready', function () {
                        // 3) cordova deviceready event triggered
                        // add cordova listeners to emit platform events
                        doc.addEventListener('backbutton', function (ev) {
                            plt.zone.run(function () {
                                plt.backButton.emit(ev);
                            });
                        });
                        doc.addEventListener('pause', function (ev) {
                            plt.zone.run(function () {
                                plt.pause.emit(ev);
                            });
                        });
                        doc.addEventListener('resume', function (ev) {
                            plt.zone.run(function () {
                                plt.resume.emit(ev);
                            });
                        });
                        // cordova has its own exitApp method
                        plt.exitApp = function () {
                            win['navigator']['app'].exitApp();
                        };
                        // cordova has fully loaded and we've added listeners
                        plt.triggerReady('cordova');
                    });
                });
            };
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return (0, _platformUtils.isCordova)(plt);
        }
    },
    /**
     * electron
     */
    'electron': {
        superset: 'core',
        initialize: function initialize(plt) {
            plt.prepareReady = function () {
                // 1) ionic bootstrapped
                plt.windowLoad(function () {
                    plt.triggerReady('electron');
                });
            };
        },
        /**
         * @param {?} plt
         * @return {?}
         */
        isMatch: function isMatch(plt) {
            return (0, _platformUtils.isElectron)(plt);
        }
    }
};
var /** @type {?} */PlatformConfigToken = exports.PlatformConfigToken = new _core.OpaqueToken('PLTCONFIG');
/**
 * @return {?}
 */
function providePlatformConfigs() {
    return PLATFORM_CONFIGS;
}
//# sourceMappingURL=platform-registry.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCordova = isCordova;
exports.isElectron = isElectron;
exports.isIos = isIos;
exports.isSafari = isSafari;
exports.isWKWebView = isWKWebView;
exports.isIosUIWebView = isIosUIWebView;
/**
 * @param {?} plt
 * @return {?}
 */
function isCordova(plt) {
  var /** @type {?} */win = plt.win();
  return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
}
/**
 * @param {?} plt
 * @return {?}
 */
function isElectron(plt) {
  return plt.testUserAgent('Electron');
}
/**
 * @param {?} plt
 * @return {?}
 */
function isIos(plt) {
  // shortcut function to be reused internally
  // checks navigator.platform to see if it's an actual iOS device
  // this does not use the user-agent string because it is often spoofed
  // an actual iPad will return true, a chrome dev tools iPad will return false
  return plt.testNavigatorPlatform('iphone|ipad|ipod');
}
/**
 * @param {?} plt
 * @return {?}
 */
function isSafari(plt) {
  return plt.testUserAgent('Safari');
}
/**
 * @param {?} plt
 * @return {?}
 */
function isWKWebView(plt) {
  return isIos(plt) && !!plt.win()['webkit'];
}
/**
 * @param {?} plt
 * @return {?}
 */
function isIosUIWebView(plt) {
  return isIos(plt) && !isWKWebView(plt) && !isSafari(plt);
}
//# sourceMappingURL=platform-utils.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Platform = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setupPlatform = setupPlatform;

var _core = require('@angular/core');

var _dom = require('./dom');

var _queryParams = require('./query-params');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * \@name Platform
 * \@description
 * The Platform service can be used to get information about your current device.
 * You can get all of the platforms associated with the device using the [platforms](#platforms)
 * method, including whether the app is being viewed from a tablet, if it's
 * on a mobile device or browser, and the exact platform (iOS, Android, etc).
 * You can also get the orientation of the device, if it uses right-to-left
 * language direction, and much much more. With this information you can completely
 * customize your app to fit any device.
 *
 * \@usage
 * ```ts
 * import { Platform } from 'ionic-angular';
 *
 * \@Component({...})
 * export MyPage {
 *   constructor(public plt: Platform) {
 *
 *   }
 * }
 * ```
 * \@demo /docs/demos/src/platform/
 */
var Platform = function () {
    function Platform() {
        var _this = this;

        _classCallCheck(this, Platform);

        this._versions = {};
        this._qp = new _queryParams.QueryParams();
        this._bbActions = [];
        this._pW = 0;
        this._pH = 0;
        this._lW = 0;
        this._lH = 0;
        this._isPortrait = null;
        this._uiEvtOpts = false;
        /**
         * \@internal
         */
        this._platforms = [];
        /**
         * @hidden
         */
        this.backButton = new _core.EventEmitter();
        /**
         * The pause event emits when the native platform puts the application
         * into the background, typically when the user switches to a different
         * application. This event would emit when a Cordova app is put into
         * the background, however, it would not fire on a standard web browser.
         */
        this.pause = new _core.EventEmitter();
        /**
         * The resume event emits when the native platform pulls the application
         * out from the background. This event would emit when a Cordova app comes
         * out from the background, however, it would not fire on a standard web browser.
         */
        this.resume = new _core.EventEmitter();
        /**
         * The resize event emits when the native platform pulls the application
         * out from the background. This event would emit when a Cordova app comes
         * out from the background, however, it would not fire on a standard web browser.
         */
        this.resize = new _core.EventEmitter();
        this._readyPromise = new Promise(function (res) {
            _this._readyResolve = res;
        });
        this.backButton.subscribe(function () {
            // the hardware back button event has been fired
            void 0;
            // decide which backbutton action should run
            _this.runBackButtonAction();
        });
    }
    /**
     * @hidden
     * @param {?} win
     * @return {?}
     */


    _createClass(Platform, [{
        key: 'setWindow',
        value: function setWindow(win) {
            this._win = win;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'win',
        value: function win() {
            return this._win;
        }
        /**
         * @hidden
         * @param {?} doc
         * @return {?}
         */

    }, {
        key: 'setDocument',
        value: function setDocument(doc) {
            this._doc = doc;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'doc',
        value: function doc() {
            return this._doc;
        }
        /**
         * @hidden
         * @param {?} zone
         * @return {?}
         */

    }, {
        key: 'setZone',
        value: function setZone(zone) {
            this.zone = zone;
        }
        /**
         * @hidden
         * @param {?} docElement
         * @return {?}
         */

    }, {
        key: 'setCssProps',
        value: function setCssProps(docElement) {
            this.Css = (0, _dom.getCss)(docElement);
        }
        /**
         * \@description
         * Depending on the platform the user is on, `is(platformName)` will
         * return `true` or `false`. Note that the same app can return `true`
         * for more than one platform name. For example, an app running from
         * an iPad would return `true` for the platform names: `mobile`,
         * `ios`, `ipad`, and `tablet`. Additionally, if the app was running
         * from Cordova then `cordova` would be true, and if it was running
         * from a web browser on the iPad then `mobileweb` would be `true`.
         *
         * ```
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyPage {
         *   constructor(public plt: Platform) {
         *     if (this.plt.is('ios')) {
         *       // This will only print when on iOS
         *       console.log("I'm an iOS device!");
         *     }
         *   }
         * }
         * ```
         *
         * | Platform Name   | Description                        |
         * |-----------------|------------------------------------|
         * | android         | on a device running Android.       |
         * | cordova         | on a device running Cordova.       |
         * | core            | on a desktop device.               |
         * | ios             | on a device running iOS.           |
         * | ipad            | on an iPad device.                 |
         * | iphone          | on an iPhone device.               |
         * | mobile          | on a mobile device.                |
         * | mobileweb       | in a browser on a mobile device.   |
         * | phablet         | on a phablet device.               |
         * | tablet          | on a tablet device.                |
         * | windows         | on a device running Windows.       |
         *
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'is',
        value: function is(platformName) {
            return this._platforms.indexOf(platformName) > -1;
        }
        /**
         * \@description
         * Depending on what device you are on, `platforms` can return multiple values.
         * Each possible value is a hierarchy of platforms. For example, on an iPhone,
         * it would return `mobile`, `ios`, and `iphone`.
         *
         * ```
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyPage {
         *   constructor(public plt: Platform) {
         *     // This will print an array of the current platforms
         *     console.log(this.plt.platforms());
         *   }
         * }
         * ```
         * @return {?}
         */

    }, {
        key: 'platforms',
        value: function platforms() {
            // get the array of active platforms, which also knows the hierarchy,
            // with the last one the most important
            return this._platforms;
        }
        /**
         * Returns an object containing version information about all of the platforms.
         *
         * ```
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyPage {
         *   constructor(public plt: Platform) {
         *     // This will print an object containing
         *     // all of the platforms and their versions
         *     console.log(plt.versions());
         *   }
         * }
         * ```
         *
         * @return {?}
         */

    }, {
        key: 'versions',
        value: function versions() {
            // get all the platforms that have a valid parsed version
            return this._versions;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'version',
        value: function version() {
            for (var /** @type {?} */platformName in this._versions) {
                if (this._versions[platformName]) {
                    return this._versions[platformName];
                }
            }
            return {};
        }
        /**
         * Returns a promise when the platform is ready and native functionality
         * can be called. If the app is running from within a web browser, then
         * the promise will resolve when the DOM is ready. When the app is running
         * from an application engine such as Cordova, then the promise will
         * resolve when Cordova triggers the `deviceready` event.
         *
         * The resolved value is the `readySource`, which states which platform
         * ready was used. For example, when Cordova is ready, the resolved ready
         * source is `cordova`. The default ready source value will be `dom`. The
         * `readySource` is useful if different logic should run depending on the
         * platform the app is running from. For example, only Cordova can execute
         * the status bar plugin, so the web should not run status bar plugin logic.
         *
         * ```
         * import { Component } from '\@angular/core';
         * import { Platform } from 'ionic-angular';
         *
         * \@Component({...})
         * export MyApp {
         *   constructor(public plt: Platform) {
         *     this.plt.ready().then((readySource) => {
         *       console.log('Platform ready from', readySource);
         *       // Platform now ready, execute any required native code
         *     });
         *   }
         * }
         * ```
         * @return {?}
         */

    }, {
        key: 'ready',
        value: function ready() {
            return this._readyPromise;
        }
        /**
         * @hidden
         * This should be triggered by the engine when the platform is
         * ready. If there was no custom prepareReady method from the engine,
         * such as Cordova or Electron, then it uses the default DOM ready.
         * @param {?} readySource
         * @return {?}
         */

    }, {
        key: 'triggerReady',
        value: function triggerReady(readySource) {
            var _this2 = this;

            this.zone.run(function () {
                _this2._readyResolve(readySource);
            });
        }
        /**
         * @hidden
         * This is the default prepareReady if it's not replaced by an engine,
         * such as Cordova or Electron. If there was no custom prepareReady
         * method from an engine then it uses the method below, which triggers
         * the platform ready on the DOM ready event, and the default resolved
         * value is `dom`.
         * @return {?}
         */

    }, {
        key: 'prepareReady',
        value: function prepareReady() {
            var /** @type {?} */self = this;
            if (self._doc.readyState === 'complete' || self._doc.readyState === 'interactive') {
                self.triggerReady('dom');
            } else {
                self._doc.addEventListener('DOMContentLoaded', completed, false);
                self._win.addEventListener('load', completed, false);
            }
            /**
             * @return {?}
             */
            function completed() {
                self._doc.removeEventListener('DOMContentLoaded', completed, false);
                self._win.removeEventListener('load', completed, false);
                self.triggerReady('dom');
            }
        }
        /**
         * Set the app's language direction, which will update the `dir` attribute
         * on the app's root `<html>` element. We recommend the app's `index.html`
         * file already has the correct `dir` attribute value set, such as
         * `<html dir="ltr">` or `<html dir="rtl">`. This method is useful if the
         * direction needs to be dynamically changed per user/session.
         * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
         * @param {?} dir
         * @param {?} updateDocument
         * @return {?}
         */

    }, {
        key: 'setDir',
        value: function setDir(dir, updateDocument) {
            this._dir = dir = (dir || '').toLowerCase();
            this.isRTL = dir === 'rtl';
            if (updateDocument !== false) {
                this._doc['documentElement'].setAttribute('dir', dir);
            }
        }
        /**
         * Returns app's language direction.
         * We recommend the app's `index.html` file already has the correct `dir`
         * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
         * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
         * @return {?}
         */

    }, {
        key: 'dir',
        value: function dir() {
            return this._dir;
        }
        /**
         * Set the app's language and optionally the country code, which will update
         * the `lang` attribute on the app's root `<html>` element.
         * We recommend the app's `index.html` file already has the correct `lang`
         * attribute value set, such as `<html lang="en">`. This method is useful if
         * the language needs to be dynamically changed per user/session.
         * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
         * @param {?} language
         * @param {?} updateDocument
         * @return {?}
         */

    }, {
        key: 'setLang',
        value: function setLang(language, updateDocument) {
            this._lang = language;
            if (updateDocument !== false) {
                this._doc['documentElement'].setAttribute('lang', language);
            }
        }
        /**
         * Returns app's language and optional country code.
         * We recommend the app's `index.html` file already has the correct `lang`
         * attribute value set, such as `<html lang="en">`.
         * [W3C: Declaring language in HTML](http://www.w3.org/International/questions/qa-html-language-declarations)
         * @return {?}
         */

    }, {
        key: 'lang',
        value: function lang() {
            return this._lang;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'exitApp',
        value: function exitApp() {}
        /**
         * The back button event is triggered when the user presses the native
         * platform's back button, also referred to as the "hardware" back button.
         * This event is only used within Cordova apps running on Android and
         * Windows platforms. This event is not fired on iOS since iOS doesn't come
         * with a hardware back button in the same sense an Android or Windows device
         * does.
         *
         * Registering a hardware back button action and setting a priority allows
         * apps to control which action should be called when the hardware back
         * button is pressed. This method decides which of the registered back button
         * actions has the highest priority and should be called.
         *
         * if this registered action has the highest priority.
         * the back button action.
         * @param {?} fn
         * @param {?=} priority
         * @return {?}
         */

    }, {
        key: 'registerBackButtonAction',
        value: function registerBackButtonAction(fn) {
            var _this3 = this;

            var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var /** @type {?} */action = { fn: fn, priority: priority };
            this._bbActions.push(action);
            // return a function to unregister this back button action
            return function () {
                (0, _util.removeArrayItem)(_this3._bbActions, action);
            };
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'runBackButtonAction',
        value: function runBackButtonAction() {
            // decide which one back button action should run
            var /** @type {?} */winner = null;
            this._bbActions.forEach(function (action) {
                if (!winner || action.priority >= winner.priority) {
                    winner = action;
                }
            });
            // run the winning action if there is one
            winner && winner.fn && winner.fn();
        }
        /**
         * @hidden
         * @param {?} userAgent
         * @return {?}
         */

    }, {
        key: 'setUserAgent',
        value: function setUserAgent(userAgent) {
            this._ua = userAgent;
        }
        /**
         * @hidden
         * @param {?} url
         * @return {?}
         */

    }, {
        key: 'setQueryParams',
        value: function setQueryParams(url) {
            this._qp.parseUrl(url);
        }
        /**
         * Get the query string parameter
         * @param {?} key
         * @return {?}
         */

    }, {
        key: 'getQueryParam',
        value: function getQueryParam(key) {
            return this._qp.get(key);
        }
        /**
         * Get the current url.
         * @return {?}
         */

    }, {
        key: 'url',
        value: function url() {
            return this._win['location']['href'];
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'userAgent',
        value: function userAgent() {
            return this._ua || '';
        }
        /**
         * @hidden
         * @param {?} navigatorPlt
         * @return {?}
         */

    }, {
        key: 'setNavigatorPlatform',
        value: function setNavigatorPlatform(navigatorPlt) {
            this._nPlt = navigatorPlt;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'navigatorPlatform',
        value: function navigatorPlatform() {
            return this._nPlt || '';
        }
        /**
         * Gets the width of the platform's viewport using `window.innerWidth`.
         * Using this method is preferred since the dimension is a cached value,
         * which reduces the chance of multiple and expensive DOM reads.
         * @return {?}
         */

    }, {
        key: 'width',
        value: function width() {
            this._calcDim();
            return this._isPortrait ? this._pW : this._lW;
        }
        /**
         * Gets the height of the platform's viewport using `window.innerHeight`.
         * Using this method is preferred since the dimension is a cached value,
         * which reduces the chance of multiple and expensive DOM reads.
         * @return {?}
         */

    }, {
        key: 'height',
        value: function height() {
            this._calcDim();
            return this._isPortrait ? this._pH : this._lH;
        }
        /**
         * @hidden
         * @param {?} ele
         * @param {?=} pseudoEle
         * @return {?}
         */

    }, {
        key: 'getElementComputedStyle',
        value: function getElementComputedStyle(ele, pseudoEle) {
            return this._win['getComputedStyle'](ele, pseudoEle);
        }
        /**
         * @hidden
         * @param {?} x
         * @param {?} y
         * @return {?}
         */

    }, {
        key: 'getElementFromPoint',
        value: function getElementFromPoint(x, y) {
            return this._doc['elementFromPoint'](x, y);
        }
        /**
         * @hidden
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: 'getElementBoundingClientRect',
        value: function getElementBoundingClientRect(ele) {
            return ele['getBoundingClientRect']();
        }
        /**
         * Returns `true` if the app is in portait mode.
         * @return {?}
         */

    }, {
        key: 'isPortrait',
        value: function isPortrait() {
            this._calcDim();
            return this._isPortrait;
        }
        /**
         * Returns `true` if the app is in landscape mode.
         * @return {?}
         */

    }, {
        key: 'isLandscape',
        value: function isLandscape() {
            return !this.isPortrait();
        }
        /**
         * @return {?}
         */

    }, {
        key: '_calcDim',
        value: function _calcDim() {
            // we're caching window dimensions so that
            // we're not forcing many layouts
            // if _isPortrait is null then that means
            // the dimensions needs to be looked up again
            // this also has to cover an edge case that only
            // happens on iOS 10 (not other versions of iOS)
            // where window.innerWidth is always bigger than
            // window.innerHeight when it is first measured,
            // even when the device is in portrait but
            // the second time it is measured it is correct.
            // Hopefully this check will not be needed in the future
            if (this._isPortrait === null || this._isPortrait === false && this._win['innerWidth'] < this._win['innerHeight']) {
                var /** @type {?} */win = this._win;
                var /** @type {?} */innerWidth = win['innerWidth'];
                var /** @type {?} */innerHeight = win['innerHeight'];
                // we're keeping track of portrait and landscape dimensions
                // separately because the virtual keyboard can really mess
                // up accurate values when the keyboard is up
                if (win.screen.width > 0 && win.screen.height > 0) {
                    if (innerWidth < innerHeight) {
                        // the device is in portrait
                        // we have to do fancier checking here
                        // because of the virtual keyboard resizing
                        // the window
                        if (this._pW <= innerWidth) {
                            void 0;
                            this._isPortrait = true;
                            this._pW = innerWidth;
                        }
                        if (this._pH <= innerHeight) {
                            void 0;
                            this._isPortrait = true;
                            this._pH = innerHeight;
                        }
                    } else {
                        // the device is in landscape
                        if (this._lW !== innerWidth) {
                            void 0;
                            this._isPortrait = false;
                            this._lW = innerWidth;
                        }
                        if (this._lH !== innerHeight) {
                            void 0;
                            this._isPortrait = false;
                            this._lH = innerHeight;
                        }
                    }
                }
            }
        }
        /**
         * @hidden
         * This requestAnimationFrame will NOT be wrapped by zone.
         * @param {?} callback
         * @return {?}
         */

    }, {
        key: 'raf',
        value: function raf(callback) {
            var /** @type {?} */win = this._win;
            return win['__zone_symbol__requestAnimationFrame'](callback);
        }
        /**
         * @hidden
         * @param {?} rafId
         * @return {?}
         */

    }, {
        key: 'cancelRaf',
        value: function cancelRaf(rafId) {
            var /** @type {?} */win = this._win;
            return win['__zone_symbol__cancelAnimationFrame'](rafId);
        }
        /**
         * @hidden
         * This setTimeout will NOT be wrapped by zone.
         * @param {?} callback
         * @param {?=} timeout
         * @return {?}
         */

    }, {
        key: 'timeout',
        value: function timeout(callback, _timeout) {
            var /** @type {?} */win = this._win;
            return win['__zone_symbol__setTimeout'](callback, _timeout);
        }
        /**
         * @hidden
         * This setTimeout will NOT be wrapped by zone.
         * @param {?} timeoutId
         * @return {?}
         */

    }, {
        key: 'cancelTimeout',
        value: function cancelTimeout(timeoutId) {
            var /** @type {?} */win = this._win;
            win['__zone_symbol__clearTimeout'](timeoutId);
        }
        /**
         * @hidden
         * Built to use modern event listener options, like "passive".
         * If options are not supported, then just return a boolean which
         * represents "capture". Returns a method to remove the listener.
         * @param {?} ele
         * @param {?} eventName
         * @param {?} callback
         * @param {?} opts
         * @param {?=} unregisterListenersCollection
         * @return {?}
         */

    }, {
        key: 'registerListener',
        value: function registerListener(ele, eventName, callback, opts, unregisterListenersCollection) {
            // use event listener options when supported
            // otherwise it's just a boolean for the "capture" arg
            var /** @type {?} */listenerOpts = this._uiEvtOpts ? {
                'capture': !!opts.capture,
                'passive': !!opts.passive
            } : !!opts.capture;
            var /** @type {?} */unReg = void 0;
            if (!opts.zone && ele['__zone_symbol__addEventListener']) {
                // do not wrap this event in zone and we've verified we can use the raw addEventListener
                ele['__zone_symbol__addEventListener'](eventName, callback, listenerOpts);
                unReg = function unregisterListener() {
                    ele['__zone_symbol__removeEventListener'](eventName, callback, listenerOpts);
                };
            } else {
                // use the native addEventListener, which is wrapped with zone
                ele['addEventListener'](eventName, callback, listenerOpts);
                unReg = function unregisterListener() {
                    ele['removeEventListener'](eventName, callback, listenerOpts);
                };
            }
            if (unregisterListenersCollection) {
                unregisterListenersCollection.push(unReg);
            }
            return unReg;
        }
        /**
         * @hidden
         * @param {?} el
         * @param {?} callback
         * @param {?=} zone
         * @return {?}
         */

    }, {
        key: 'transitionEnd',
        value: function transitionEnd(el, callback) {
            var zone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var /** @type {?} */unRegs = [];
            /**
             * @return {?}
             */
            function unregister() {
                unRegs.forEach(function (unReg) {
                    unReg();
                });
            }
            /**
             * @param {?} ev
             * @return {?}
             */
            function onTransitionEnd(ev) {
                if (el === ev.target) {
                    unregister();
                    callback(ev);
                }
            }
            if (el) {
                this.registerListener(el, 'webkitTransitionEnd', /** @type {?} */onTransitionEnd, { zone: zone }, unRegs);
                this.registerListener(el, 'transitionend', /** @type {?} */onTransitionEnd, { zone: zone }, unRegs);
            }
            return unregister;
        }
        /**
         * @hidden
         * @param {?} callback
         * @return {?}
         */

    }, {
        key: 'windowLoad',
        value: function windowLoad(callback) {
            var /** @type {?} */win = this._win;
            var /** @type {?} */doc = this._doc;
            var /** @type {?} */unreg = void 0;
            if (doc.readyState === 'complete') {
                callback(win, doc);
            } else {
                unreg = this.registerListener(win, 'load', function () {
                    unreg && unreg();
                    callback(win, doc);
                }, { zone: false });
            }
        }
        /**
         * @hidden
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: 'isActiveElement',
        value: function isActiveElement(ele) {
            return !!(ele && this.getActiveElement() === ele);
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'getActiveElement',
        value: function getActiveElement() {
            return this._doc['activeElement'];
        }
        /**
         * @hidden
         * @param {?} ele
         * @return {?}
         */

    }, {
        key: 'hasFocus',
        value: function hasFocus(ele) {
            return !!(ele && this.getActiveElement() === ele && ele.parentElement.querySelector(':focus') === ele);
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'hasFocusedTextInput',
        value: function hasFocusedTextInput() {
            var /** @type {?} */ele = this.getActiveElement();
            if ((0, _dom.isTextInput)(ele)) {
                return ele.parentElement.querySelector(':focus') === ele;
            }
            return false;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'focusOutActiveElement',
        value: function focusOutActiveElement() {
            var /** @type {?} */activeElement = this.getActiveElement();
            activeElement && activeElement.blur && activeElement.blur();
        }
        /**
         * @return {?}
         */

    }, {
        key: '_initEvents',
        value: function _initEvents() {
            var _this4 = this;

            // Test via a getter in the options object to see if the passive property is accessed
            try {
                var /** @type {?} */opts = Object.defineProperty({}, 'passive', {
                    get: function get() {
                        _this4._uiEvtOpts = true;
                    }
                });
                this._win.addEventListener('optsTest', null, opts);
            } catch (e) {}
            // add the window resize event listener XXms after
            this.timeout(function () {
                var /** @type {?} */timerId;
                _this4.registerListener(_this4._win, 'resize', function () {
                    clearTimeout(timerId);
                    timerId = setTimeout(function () {
                        // setting _isPortrait to null means the
                        // dimensions will need to be looked up again
                        if (_this4.hasFocusedTextInput() === false) {
                            _this4._isPortrait = null;
                        }
                        _this4.zone.run(function () {
                            return _this4.resize.emit();
                        });
                    }, 200);
                }, { passive: true, zone: false });
            }, 2000);
        }
        /**
         * @hidden
         * @param {?} platformConfigs
         * @return {?}
         */

    }, {
        key: 'setPlatformConfigs',
        value: function setPlatformConfigs(platformConfigs) {
            this._registry = platformConfigs || {};
        }
        /**
         * @hidden
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'getPlatformConfig',
        value: function getPlatformConfig(platformName) {
            return this._registry[platformName] || {};
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'registry',
        value: function registry() {
            return this._registry;
        }
        /**
         * @hidden
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'setDefault',
        value: function setDefault(platformName) {
            this._default = platformName;
        }
        /**
         * @hidden
         * @param {?} queryValue
         * @param {?} queryTestValue
         * @return {?}
         */

    }, {
        key: 'testQuery',
        value: function testQuery(queryValue, queryTestValue) {
            var /** @type {?} */valueSplit = queryValue.toLowerCase().split(';');
            return valueSplit.indexOf(queryTestValue) > -1;
        }
        /**
         * @hidden
         * @param {?} navigatorPlatformExpression
         * @return {?}
         */

    }, {
        key: 'testNavigatorPlatform',
        value: function testNavigatorPlatform(navigatorPlatformExpression) {
            var /** @type {?} */rgx = new RegExp(navigatorPlatformExpression, 'i');
            return rgx.test(this._nPlt);
        }
        /**
         * @hidden
         * @param {?} userAgentExpression
         * @return {?}
         */

    }, {
        key: 'matchUserAgentVersion',
        value: function matchUserAgentVersion(userAgentExpression) {
            if (this._ua && userAgentExpression) {
                var /** @type {?} */val = this._ua.match(userAgentExpression);
                if (val) {
                    return {
                        major: val[1],
                        minor: val[2]
                    };
                }
            }
        }
        /**
         * @param {?} expression
         * @return {?}
         */

    }, {
        key: 'testUserAgent',
        value: function testUserAgent(expression) {
            if (this._ua) {
                return this._ua.indexOf(expression) >= 0;
            }
            return false;
        }
        /**
         * @hidden
         * @param {?} queryStringName
         * @param {?=} userAgentAtLeastHas
         * @param {?=} userAgentMustNotHave
         * @return {?}
         */

    }, {
        key: 'isPlatformMatch',
        value: function isPlatformMatch(queryStringName, userAgentAtLeastHas) {
            var userAgentMustNotHave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            var /** @type {?} */queryValue = this._qp.get('ionicplatform');
            if (queryValue) {
                return this.testQuery(queryValue, queryStringName);
            }
            userAgentAtLeastHas = userAgentAtLeastHas || [queryStringName];
            var /** @type {?} */userAgent = this._ua.toLowerCase();
            for (var /** @type {?} */i = 0; i < userAgentAtLeastHas.length; i++) {
                if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
                    for (var /** @type {?} */j = 0; j < userAgentMustNotHave.length; j++) {
                        if (userAgent.indexOf(userAgentMustNotHave[j]) > -1) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        }
        /**
         * @hidden
         * @return {?}
         */

    }, {
        key: 'init',
        value: function init() {
            this._initEvents();
            var /** @type {?} */rootPlatformNode = void 0;
            var /** @type {?} */enginePlatformNode = void 0;
            // figure out the most specific platform and active engine
            var /** @type {?} */tmpPlt = void 0;
            for (var /** @type {?} */platformName in this._registry) {
                tmpPlt = this.matchPlatform(platformName);
                if (tmpPlt) {
                    // we found a platform match!
                    // check if its more specific than the one we already have
                    if (tmpPlt.isEngine) {
                        // because it matched then this should be the active engine
                        // you cannot have more than one active engine
                        enginePlatformNode = tmpPlt;
                    } else if (!rootPlatformNode || tmpPlt.depth > rootPlatformNode.depth) {
                        // only find the root node for platforms that are not engines
                        // set this node as the root since we either don't already
                        // have one, or this one is more specific that the current one
                        rootPlatformNode = tmpPlt;
                    }
                }
            }
            if (!rootPlatformNode) {
                rootPlatformNode = new PlatformNode(this._registry, this._default);
            }
            // build a Platform instance filled with the
            // hierarchy of active platforms and settings
            if (rootPlatformNode) {
                // check if we found an engine node (cordova/node-webkit/etc)
                if (enginePlatformNode) {
                    // add the engine to the first in the platform hierarchy
                    // the original rootPlatformNode now becomes a child
                    // of the engineNode, which is not the new root
                    enginePlatformNode.child = rootPlatformNode;
                    rootPlatformNode.parent = enginePlatformNode;
                    rootPlatformNode = enginePlatformNode;
                }
                var /** @type {?} */platformNode = rootPlatformNode;
                while (platformNode) {
                    insertSuperset(this._registry, platformNode);
                    platformNode = platformNode.child;
                }
                // make sure the root noot is actually the root
                // incase a node was inserted before the root
                platformNode = rootPlatformNode.parent;
                while (platformNode) {
                    rootPlatformNode = platformNode;
                    platformNode = platformNode.parent;
                }
                platformNode = rootPlatformNode;
                while (platformNode) {
                    platformNode.initialize(this);
                    // extra check for ipad pro issue
                    // https://forums.developer.apple.com/thread/25948
                    if (platformNode.name === 'iphone' && this.navigatorPlatform() === 'iPad') {
                        // this is an ipad pro so push ipad and tablet to platforms
                        // and then return as we are done
                        this._platforms.push('tablet');
                        this._platforms.push('ipad');
                        return;
                    }
                    // set the array of active platforms with
                    // the last one in the array the most important
                    this._platforms.push(platformNode.name);
                    // get the platforms version if a version parser was provided
                    this._versions[platformNode.name] = platformNode.version(this);
                    // go to the next platform child
                    platformNode = platformNode.child;
                }
            }
            if (this._platforms.indexOf('mobile') > -1 && this._platforms.indexOf('cordova') === -1) {
                this._platforms.push('mobileweb');
            }
        }
        /**
         * @hidden
         * @param {?} platformName
         * @return {?}
         */

    }, {
        key: 'matchPlatform',
        value: function matchPlatform(platformName) {
            // build a PlatformNode and assign config data to it
            // use it's getRoot method to build up its hierarchy
            // depending on which platforms match
            var /** @type {?} */platformNode = new PlatformNode(this._registry, platformName);
            var /** @type {?} */rootNode = platformNode.getRoot(this);
            if (rootNode) {
                rootNode.depth = 0;
                var /** @type {?} */childPlatform = rootNode.child;
                while (childPlatform) {
                    rootNode.depth++;
                    childPlatform = childPlatform.child;
                }
            }
            return rootNode;
        }
    }]);

    return Platform;
}();

exports.Platform = Platform;

function Platform_tsickle_Closure_declarations() {
    /** @type {?} */
    Platform.prototype._win;
    /** @type {?} */
    Platform.prototype._doc;
    /** @type {?} */
    Platform.prototype._versions;
    /** @type {?} */
    Platform.prototype._dir;
    /** @type {?} */
    Platform.prototype._lang;
    /** @type {?} */
    Platform.prototype._ua;
    /** @type {?} */
    Platform.prototype._qp;
    /** @type {?} */
    Platform.prototype._nPlt;
    /** @type {?} */
    Platform.prototype._readyPromise;
    /** @type {?} */
    Platform.prototype._readyResolve;
    /** @type {?} */
    Platform.prototype._bbActions;
    /** @type {?} */
    Platform.prototype._registry;
    /** @type {?} */
    Platform.prototype._default;
    /** @type {?} */
    Platform.prototype._pW;
    /** @type {?} */
    Platform.prototype._pH;
    /** @type {?} */
    Platform.prototype._lW;
    /** @type {?} */
    Platform.prototype._lH;
    /** @type {?} */
    Platform.prototype._isPortrait;
    /** @type {?} */
    Platform.prototype._uiEvtOpts;
    /**
     * @hidden
     * @type {?}
     */
    Platform.prototype.zone;
    /**
     * \@internal
     * @type {?}
     */
    Platform.prototype.Css;
    /**
     * \@internal
     * @type {?}
     */
    Platform.prototype._platforms;
    /**
     * Returns if this app is using right-to-left language direction or not.
     * We recommend the app's `index.html` file already has the correct `dir`
     * attribute value set, such as `<html dir="ltr">` or `<html dir="rtl">`.
     * [W3C: Structural markup and right-to-left text in HTML](http://www.w3.org/International/questions/qa-html-dir)
     * @type {?}
     */
    Platform.prototype.isRTL;
    /**
     * @hidden
     * @type {?}
     */
    Platform.prototype.backButton;
    /**
     * The pause event emits when the native platform puts the application
     * into the background, typically when the user switches to a different
     * application. This event would emit when a Cordova app is put into
     * the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.pause;
    /**
     * The resume event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.resume;
    /**
     * The resize event emits when the native platform pulls the application
     * out from the background. This event would emit when a Cordova app comes
     * out from the background, however, it would not fire on a standard web browser.
     * @type {?}
     */
    Platform.prototype.resize;
}
/**
 * @param {?} registry
 * @param {?} platformNode
 * @return {?}
 */
function insertSuperset(registry, platformNode) {
    var /** @type {?} */supersetPlaformName = platformNode.superset();
    if (supersetPlaformName) {
        // add a platform in between two exist platforms
        // so we can build the correct hierarchy of active platforms
        var /** @type {?} */supersetPlatform = new PlatformNode(registry, supersetPlaformName);
        supersetPlatform.parent = platformNode.parent;
        supersetPlatform.child = platformNode;
        if (supersetPlatform.parent) {
            supersetPlatform.parent.child = supersetPlatform;
        }
        platformNode.parent = supersetPlatform;
    }
}
/**
 * @hidden
 */

var PlatformNode = function () {
    /**
     * @param {?} registry
     * @param {?} platformName
     */
    function PlatformNode(registry, platformName) {
        _classCallCheck(this, PlatformNode);

        this.registry = registry;
        this.c = registry[platformName];
        this.name = platformName;
        this.isEngine = this.c.isEngine;
    }
    /**
     * @return {?}
     */


    _createClass(PlatformNode, [{
        key: 'settings',
        value: function settings() {
            return this.c.settings || {};
        }
        /**
         * @return {?}
         */

    }, {
        key: 'superset',
        value: function superset() {
            return this.c.superset;
        }
        /**
         * @param {?} p
         * @return {?}
         */

    }, {
        key: 'isMatch',
        value: function isMatch(p) {
            return this.c.isMatch && this.c.isMatch(p) || false;
        }
        /**
         * @param {?} plt
         * @return {?}
         */

    }, {
        key: 'initialize',
        value: function initialize(plt) {
            this.c.initialize && this.c.initialize(plt);
        }
        /**
         * @param {?} plt
         * @return {?}
         */

    }, {
        key: 'version',
        value: function version(plt) {
            if (this.c.versionParser) {
                var /** @type {?} */v = this.c.versionParser(plt);
                if (v) {
                    var /** @type {?} */str = v.major + '.' + v.minor;
                    return {
                        str: str,
                        num: parseFloat(str),
                        major: parseInt(v.major, 10),
                        minor: parseInt(v.minor, 10)
                    };
                }
            }
        }
        /**
         * @param {?} plt
         * @return {?}
         */

    }, {
        key: 'getRoot',
        value: function getRoot(plt) {
            if (this.isMatch(plt)) {
                var /** @type {?} */parents = this.getSubsetParents(this.name);
                if (!parents.length) {
                    return this;
                }
                var /** @type {?} */platformNode = null;
                var /** @type {?} */rootPlatformNode = null;
                for (var /** @type {?} */i = 0; i < parents.length; i++) {
                    platformNode = new PlatformNode(this.registry, parents[i]);
                    platformNode.child = this;
                    rootPlatformNode = platformNode.getRoot(plt);
                    if (rootPlatformNode) {
                        this.parent = platformNode;
                        return rootPlatformNode;
                    }
                }
            }
            return null;
        }
        /**
         * @param {?} subsetPlatformName
         * @return {?}
         */

    }, {
        key: 'getSubsetParents',
        value: function getSubsetParents(subsetPlatformName) {
            var /** @type {?} */parentPlatformNames = [];
            var /** @type {?} */pltConfig = null;
            for (var /** @type {?} */platformName in this.registry) {
                pltConfig = this.registry[platformName];
                if (pltConfig.subsets && pltConfig.subsets.indexOf(subsetPlatformName) > -1) {
                    parentPlatformNames.push(platformName);
                }
            }
            return parentPlatformNames;
        }
    }]);

    return PlatformNode;
}();

function PlatformNode_tsickle_Closure_declarations() {
    /** @type {?} */
    PlatformNode.prototype.c;
    /** @type {?} */
    PlatformNode.prototype.parent;
    /** @type {?} */
    PlatformNode.prototype.child;
    /** @type {?} */
    PlatformNode.prototype.name;
    /** @type {?} */
    PlatformNode.prototype.isEngine;
    /** @type {?} */
    PlatformNode.prototype.depth;
    /** @type {?} */
    PlatformNode.prototype.registry;
}
/**
 * @hidden
 * @param {?} doc
 * @param {?} platformConfigs
 * @param {?} zone
 * @return {?}
 */
function setupPlatform(doc, platformConfigs, zone) {
    var /** @type {?} */plt = new Platform();
    plt.setDefault('core');
    plt.setPlatformConfigs(platformConfigs);
    plt.setZone(zone);
    // set values from "document"
    var /** @type {?} */docElement = doc.documentElement;
    plt.setDocument(doc);
    plt.setDir(docElement.dir, false);
    plt.setLang(docElement.lang, false);
    // set css properties
    plt.setCssProps(docElement);
    // set values from "window"
    var /** @type {?} */win = doc.defaultView;
    plt.setWindow(win);
    plt.setNavigatorPlatform(win.navigator.platform);
    plt.setUserAgent(win.navigator.userAgent);
    // set location values
    plt.setQueryParams(win.location.href);
    plt.init();
    // add the platform obj to the window
    win['Ionic'] = win['Ionic'] || {};
    win['Ionic']['platform'] = plt;
    return plt;
}
//# sourceMappingURL=platform.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @hidden
 */
var QueryParams = exports.QueryParams = function () {
    function QueryParams() {
        _classCallCheck(this, QueryParams);

        this.data = {};
    }
    /**
     * @param {?} url
     * @return {?}
     */


    _createClass(QueryParams, [{
        key: 'parseUrl',
        value: function parseUrl(url) {
            if (url) {
                var /** @type {?} */startIndex = url.indexOf('?');
                if (startIndex > -1) {
                    var /** @type {?} */queries = url.slice(startIndex + 1).split('&');
                    for (var /** @type {?} */i = 0; i < queries.length; i++) {
                        if (queries[i].indexOf('=') > 0) {
                            var /** @type {?} */split = queries[i].split('=');
                            if (split.length > 1) {
                                this.data[split[0].toLowerCase()] = split[1].split('#')[0];
                            }
                        }
                    }
                }
            }
        }
        /**
         * @param {?} key
         * @return {?}
         */

    }, {
        key: 'get',
        value: function get(key) {
            return this.data[key.toLowerCase()];
        }
    }]);

    return QueryParams;
}();

function QueryParams_tsickle_Closure_declarations() {
    /** @type {?} */
    QueryParams.prototype.data;
}
//# sourceMappingURL=query-params.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.clamp = clamp;
exports.deepCopy = deepCopy;
exports.deepEqual = deepEqual;
exports.debounce = debounce;
exports.normalizeURL = normalizeURL;
exports.defaults = defaults;
exports.isBoolean = isBoolean;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isFunction = isFunction;
exports.isDefined = isDefined;
exports.isUndefined = isUndefined;
exports.isPresent = isPresent;
exports.isBlank = isBlank;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isPrimitive = isPrimitive;
exports.isTrueProperty = isTrueProperty;
exports.isCheckedProperty = isCheckedProperty;
exports.isRightSide = isRightSide;
exports.reorderArray = reorderArray;
exports.removeArrayItem = removeArrayItem;
exports.swipeShouldReset = swipeShouldReset;
exports.requestIonicCallback = requestIonicCallback;
/**
 * @hidden
 * Given a min and max, restrict the given number
 * to the range.
 * @param {?} min the minimum
 * @param {?} n the value
 * @param {?} max the maximum
 * @return {?}
 */
function clamp(min, n, max) {
    return Math.max(min, Math.min(n, max));
}
/**
 * @hidden
 * @param {?} obj
 * @return {?}
 */
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * @hidden
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    return JSON.stringify(a) === JSON.stringify(b);
}
/**
 * @hidden
 * @param {?} fn
 * @param {?} wait
 * @param {?=} immediate
 * @return {?}
 */
function debounce(fn, wait) {
    var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var /** @type {?} */timeout, /** @type {?} */args, /** @type {?} */context, /** @type {?} */timestamp, /** @type {?} */result;
    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var /** @type {?} */later = function later() {
            var /** @type {?} */last = Date.now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) result = fn.apply(context, args);
            }
        };
        var /** @type {?} */callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) result = fn.apply(context, args);
        return result;
    };
}
/**
 * Rewrites an absolute URL so it works across file and http based engines.
 * @param {?} url
 * @return {?}
 */
function normalizeURL(url) {
    var /** @type {?} */ionic = window['Ionic'];
    if (ionic && ionic.normalizeURL) {
        return ionic.normalizeURL(url);
    }
    return url;
}
/**
 * @hidden
 * Apply default arguments if they don't exist in
 * the first object.
 * @param {?} dest
 * @param {...?} args
 * @return {?}
 */
function defaults(dest) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    for (var /** @type {?} */i = arguments.length - 1; i >= 1; i--) {
        var /** @type {?} */source = arguments[i];
        if (source) {
            for (var /** @type {?} */key in source) {
                if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isBoolean(val) {
    return typeof val === 'boolean';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isString(val) {
    return typeof val === 'string';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isNumber(val) {
    return typeof val === 'number';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isFunction(val) {
    return typeof val === 'function';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isDefined(val) {
    return typeof val !== 'undefined';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isUndefined(val) {
    return typeof val === 'undefined';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isPresent(val) {
    return val !== undefined && val !== null;
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isBlank(val) {
    return val === undefined || val === null;
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isObject(val) {
    return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
}
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isArray(val) {
    return Array.isArray(val);
}
;
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isPrimitive(val) {
    return isString(val) || isBoolean(val) || isNumber(val) && !isNaN(val);
}
;
/**
 * @hidden
 * @param {?} val
 * @return {?}
 */
function isTrueProperty(val) {
    if (typeof val === 'string') {
        val = val.toLowerCase().trim();
        return val === 'true' || val === 'on' || val === '';
    }
    return !!val;
}
;
/**
 * @hidden
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function isCheckedProperty(a, b) {
    if (a === undefined || a === null || a === '') {
        return b === undefined || b === null || b === '';
    } else if (a === true || a === 'true') {
        return b === true || b === 'true';
    } else if (a === false || a === 'false') {
        return b === false || b === 'false';
    } else if (a === 0 || a === '0') {
        return b === 0 || b === '0';
    }
    // not using strict comparison on purpose
    return a == b; // tslint:disable-line
}
;
/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param {?} side the side
 * @param {?} isRTL whether the application dir is rtl
 * @param {?=} defaultRight whether the default side is right
 * @return {?}
 */
function isRightSide(side, isRTL) {
    var defaultRight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    switch (side) {
        case 'right':
            return true;
        case 'left':
            return false;
        case 'end':
            return !isRTL;
        case 'start':
            return isRTL;
        default:
            return defaultRight ? !isRTL : isRTL;
    }
}
/**
 * @hidden
 * @param {?} array
 * @param {?} indexes
 * @return {?}
 */
function reorderArray(array, indexes) {
    var /** @type {?} */element = array[indexes.from];
    array.splice(indexes.from, 1);
    array.splice(indexes.to, 0, element);
    return array;
}
/**
 * @hidden
 * @param {?} array
 * @param {?} item
 * @return {?}
 */
function removeArrayItem(array, item) {
    var /** @type {?} */index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}
/**
 * @hidden
 * @param {?} isResetDirection
 * @param {?} isMovingFast
 * @param {?} isOnResetZone
 * @return {?}
 */
function swipeShouldReset(isResetDirection, isMovingFast, isOnResetZone) {
    // The logic required to know when the sliding item should close (openAmount=0)
    // depends on three booleans (isCloseDirection, isMovingFast, isOnCloseZone)
    // and it ended up being too complicated to be written manually without errors
    // so the truth table is attached below: (0=false, 1=true)
    // isCloseDirection | isMovingFast | isOnCloseZone || shouldClose
    //         0        |       0      |       0       ||    0
    //         0        |       0      |       1       ||    1
    //         0        |       1      |       0       ||    0
    //         0        |       1      |       1       ||    0
    //         1        |       0      |       0       ||    0
    //         1        |       0      |       1       ||    1
    //         1        |       1      |       0       ||    1
    //         1        |       1      |       1       ||    1
    // The resulting expression was generated by resolving the K-map (Karnaugh map):
    var /** @type {?} */shouldClose = !isMovingFast && isOnResetZone || isResetDirection && isMovingFast;
    return shouldClose;
}
/**
 * @hidden
 */
var ASSERT_ENABLED = true;
/**
 * @hidden
 * @param {?} fn
 * @return {?}
 */
function _runInDev(fn) {
    if (ASSERT_ENABLED === true) {
        return fn();
    }
}
/**
 * @hidden
 * @param {?} actual
 * @param {?} reason
 * @return {?}
 */
function _assert(actual, reason) {
    if (!actual && ASSERT_ENABLED === true) {
        var /** @type {?} */message = 'IONIC ASSERT: ' + reason;
        console.error(message);
        debugger; // tslint:disable-line
        throw new Error(message);
    }
}
/**
 * @hidden
 * @param {?} functionToLazy
 * @return {?}
 */
function requestIonicCallback(functionToLazy) {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(functionToLazy);
    } else {
        return setTimeout(functionToLazy, 500);
    }
}
/** @hidden */
exports.assert = _assert;
/** @hidden */

exports.runInDev = _runInDev;
//# sourceMappingURL=util.js.map