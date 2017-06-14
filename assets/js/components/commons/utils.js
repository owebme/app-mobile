(function(app, utils){

	utils.init = function(namespace){
		if (!namespace) return;

		var parts = namespace.split("."),
	        component = app,
	        i;

	    for (i = 0; i < parts.length; i++) {
	        component = component[parts[i]];
	    }

		if (component && typeof component.init === "function"){
			component.init();
			utils.log("Initialize: <" + namespace + "> ready");
		}
		else {
			utils.log("ERROR: <" + namespace + "> initialize");
		}
	};

	utils.is = function(namespace, callback){
		if (!namespace) return;

		var parts = namespace.split("."),
	        component = app,
	        i;

	    for (i = 0; i < parts.length; i++) {
	        component = component[parts[i]];
	    }

		if (component){
			if (callback && typeof callback === "function"){
				callback();
			}
		}
		else {
			utils.log("NOT found: <" + namespace + ">");
		}
	};

	utils.log = function(data){
		if (!data) return;

		if (typeof data === "object"){
			console.dir(data);
		}
		else {
			console.log(data);
		}
	};

	utils.logger = function(event, data){
		if (!event || !data) return;

		if (event === "init") utils.log("Initialize: <" + data + "> ready");
		else if (event === "open") utils.log("OPEN: <" + data + ">");
		else if (event === "close") utils.log("CLOSE: <" + data + ">");
		else utils.log(event + ": <" + data + ">");
	};

	utils.random = function(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	};

	utils.template = function(name, data, node){

		if (!app.templates[name]) {
			utils.log("NOT found: <" + name + "> template");
			return;
		}

		var tpl = Mustache.render(app.templates[name](), data ? data : {}),
			result = $(tpl).appendTo(node ? node : app.$dom.root);

		return result;
	};

	utils.copyArray = function(arr) {
	  var newObj = arr === null ? null : (!utils.isObject(arr) ? [] : {});
	  for (var i in arr) {
	    if (typeof(arr[i]) === 'object' && i !== 'prototype') {
	      newObj[i] = utils.copyArray(arr[i]);
	    } else {
	      newObj[i] = arr[i];
	    }
	  }
	  return newObj;
    };

	utils.sortArray = function(arr, field, direction){
		var data = _.sortBy(arr, function(item){
			return item[field];
		});
		if (direction === "desc"){
			return data.reverse();
		}
		else {
			return data;
		}
	};

	utils.sortByDate = function(arr, field, direction){
		if (!window.moment) return arr;
		var data = _.sortBy(arr, function(item){
			return moment(item[field]).format("X");
		});
		if (direction === "desc"){
			return data.reverse();
		}
		else {
			return data;
		}
	};

	utils.isArray = function(arr){
		if (arr && Object.prototype.toString.call(arr) === '[object Array]'){
		    return true;
		}
	};

	utils.isFunction = function(fn){
		if (fn && typeof fn === 'function'){
		    return true;
		}
	};

	utils.fixTouchScroll = function($container, $scroll){
		var touchY = null,
			scrollY = null;

		$container.on('touchmove MSPointerMove', function(e){
			if (scrollY === 0){
				var lastTouchY = e.changedTouches[0].clientY;
				if (lastTouchY < touchY){
					touchY = 0;
					e.preventDefault();
				}
				else {
					if (app.device && app.device.isIOS){
						setTimeout(function(){
							touchY = lastTouchY;
						}, 1000);
					}
					else {
						touchY = lastTouchY;
					}
				}
			}
		});

		$scroll.on('scroll', function(){
			scrollY = this.scrollTop;
		});
	};

	utils.raf = function(callback){
		var func = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame;
		if (func) {
			return func(callback);
		} else {
			return window.setTimeout(callback, 1000 / 60);
		}
	};

	utils.caf = function(frame){
		var func = window.cancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
		func(frame);
		frame = null;
	};

	utils.support = {transitions: Modernizr.csstransitions},
	utils.transEndEventNames = {'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend'};
	utils.transEndEventName = utils.transEndEventNames[Modernizr.prefixed('transition')];
	utils.animEndEventNames = {'WebkitAnimation': 'webkitAnimationEnd', 'MozAnimation': 'animationend', 'OAnimation': 'oAnimationEnd', 'msAnimation': 'MSAnimationEnd', 'animation': 'animationend'};
	utils.animEndEventName = utils.animEndEventNames[Modernizr.prefixed('animation')];

	utils.onEndTransition = function(el, callback){
		var onEndCallbackFn = function( ev ) {
			if ( utils.support.transitions ) {
				if( ev.target != this ) return;
				this.removeEventListener( utils.transEndEventName, onEndCallbackFn );
			}
			if( callback && typeof callback === 'function' ) { callback.call(this); }
		};
		if( utils.support.transitions ) {
			el.addEventListener( utils.transEndEventName, onEndCallbackFn );
		}
		else {
			onEndCallbackFn();
		}
	};

	utils.onEndAnimation = function(el, callback){
		var onEndCallbackFn = function( ev ) {
			if ( utils.support.transitions ) {
				if( ev.target != this ) return;
				this.removeEventListener( utils.animEndEventName, onEndCallbackFn );
			}
			if( callback && typeof callback === 'function' ) { callback.call(this); }
		};
		if( utils.support.transitions ) {
			el.addEventListener( utils.animEndEventName, onEndCallbackFn );
		}
		else {
			onEndCallbackFn();
		}
	};

	utils.onLoadImage = function(url, callback) {
		var img = new Image(),
			loaded = false;

	    function loadHandler() {
	        if (loaded) return;
	        loaded = true;
			callback(true);
	    }
		function errHandler() {
	        callback(false);
	    }
		img.src = url;
		img.onerror = errHandler;
		img.onload = loadHandler;
	    if (img.complete) loadHandler();
	};

	utils.getSizeImage = function(url, callback) {
	    var img = new Image(),
			loaded = false;

	    function loadHandler() {
	        if (loaded) return;
	        loaded = true;
			callback(img.naturalWidth, img.naturalHeight);
	    }
		function errHandler() {
	        callback(false);
	    }
		img.src = url;
		img.onerror = errHandler;
		img.onload = loadHandler;
	    if (img.complete) loadHandler();
	};

	utils.getBoundingClientRect = function(elem){
		var a = elem.getBoundingClientRect();
		return {
			top: a.top,
			right: a.right,
			bottom: a.bottom,
			left: a.left,
			width: a.width || a.right - a.left,
			height: a.height || a.bottom - a.top
		}
	};

	utils.getScroll = function(scroll) {
        var x = scroll.x * -1,
            y = scroll.y * -1,
			maxX = scroll.maxScrollX * -1,
			maxY = scroll.maxScrollY * -1;
        return {x: x, y: y, maxX: maxX, maxY: maxY};
    };

	utils.throttle = function(fn, delay) {
		var allowSample = true;

		return function(e) {
			if (allowSample) {
				allowSample = false;
				setTimeout(function() { allowSample = true; }, delay);
				fn(e);
			}
		};
	};

	utils.debounce = function(fn, timeout, invokeAsap, ctx) {
		if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
			ctx = invokeAsap;
			invokeAsap = false;
		}

		var timer;

		return function() {

			var args = arguments;
            ctx = ctx || this;

			invokeAsap && !timer && fn.apply(ctx, args);

			clearTimeout(timer);

			timer = setTimeout(function() {
				!invokeAsap && fn.apply(ctx, args);
				timer = null;
			}, timeout);

		};
	};

	utils.indexOf = function(arr, value, from) {
		for (var i = from || 0, l = (arr || []).length; i < l; i++) {
			if (arr[i] == value) return i;
		}
		return -1;
  	};

	utils.inArray = function(arr, value) {
		return utils.indexOf(arr, value) != -1;
	};

	utils.trim = function(text) {
		return (text && String(text) || '').replace(/^\s+|\s+$/g, '');
	};

	utils.underscored = function(str) {
		return utils.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
	};

	utils.deepExtend = function(target, source) {
	    for (var prop in source) {
	        if (source.hasOwnProperty(prop)) {
	            if (target[prop] && typeof source[prop] === 'object') {
	                utils.deepExtend(target[prop], source[prop]);
	            }
	            else {
	                target[prop] = source[prop];
	            }
	        }
	    }
	    return target;
	};

	utils.deepFindWhere = function(obj, p, v, result){
		if (v === undefined && !result) result = [];
	    if (obj instanceof Array) {
	        for (var i = 0; i < obj.length; i++) {
	            result = utils.deepFindWhere(obj[i], p, v, result);
	        }
	    }
	    else {
	        for (var prop in obj) {
	            if (prop == p) {
					if (v !== undefined && obj[prop] === v){
	                    result = obj;
	                }
					else if (v === undefined) {
						result.push(obj);
					}
	            }
	            if (obj[prop] instanceof Object || obj[prop] instanceof Array){
	                result = utils.deepFindWhere(obj[prop], p, v, result);
				}
	        }
	    }
	    return result;
	};

	utils.numberFormat = function(number, dec, dsep, tsep) {
		if (isNaN(number) || number == null) return '';

		number = parseInt(number).toFixed(~~dec);
		tsep = typeof tsep == 'string' ? tsep : ',';

		var parts = number.split('.'),
			fnums = parts[0],
			decimals = parts[1] ? (dsep || '.') + parts[1] : '';

		return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
	};

	utils.clean = function(field, def) {
		field = utils.trim(field);
		return field ? field : (def !== undefined ? def : null);
	};

	utils.isObject = function(obj) { return Object.prototype.toString.call(obj) === '[object Object]'};

	utils.isEmail = function(str){
		return str.match(/.+@.+\..+/i);
	};

	utils.newId = function(){
		return String(Math.round(new Date().getTime() / 1000));
	};

	utils.getDateNow = function(){
		var d = new Date();
		var hour = d.getHours();
		var minute = d.getMinutes();
		var seconds = d.getSeconds();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var year = d.getFullYear();
		if (hour < 10) hour = "0"+hour;
		if (minute < 10) minute = "0"+minute;
		if (seconds < 10) seconds = "0"+seconds;
		if (month < 10) month = "0"+month;
		if (day < 10) day = "0"+day;

		return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+seconds;
	};

	Date.prototype.addDays = function(days) {
	    var date = new Date(this.valueOf());
	    date.setDate(date.getDate() + days);
	    return date;
	};

	utils.getDates = function(startDate, stopDate) {
	    var dateArray = new Array();
	    var currentDate = startDate;
	    while (currentDate <= stopDate) {
	        dateArray.push(new Date(currentDate));
	        currentDate = currentDate.addDays(1);
	    }
	    return dateArray;
	};

	utils.supportClipboard = function(){
		if (window.clipboardData && window.clipboardData.setData || document.queryCommandSupported && document.queryCommandSupported("copy")) {
			return true;
		}
		else {
			return false;
		}
	};

	utils.copyToClip = function(text){
	    if (window.clipboardData && window.clipboardData.setData) {
	        // IE specific code path to prevent textarea being shown while dialog is visible.
	        return clipboardData.setData("Text", text);

	    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
	        var textarea = document.createElement("textarea");
	        textarea.textContent = text;
	        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
	        document.body.appendChild(textarea);
	        textarea.select();
	        try {
	            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
	        } catch (ex) {
	            console.warn("Copy to clipboard failed.", ex);
	            return false;
	        } finally {
	            document.body.removeChild(textarea);
	        }
	    }
	};

	utils.bbUpdate = function(obj, callback){
		obj.on("update", function(e){
	        var prop = e.data && e.data.transaction && e.data.transaction.length && e.data.transaction[0].path ? e.data.transaction[0].path[0] : null,
	            value = e.data && e.data.transaction && e.data.transaction.length ? e.data.transaction[0].value : null;

	        callback(prop, value, e);
		});
    };

	utils.translitGost = (function(){
		var rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
			eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g);

		return function(text, engToRus) {
			var x;
			for(x = 0; x < rus.length; x++) {
				text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
				text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
			}
			return text;
		}
	})();

	utils.translit = function(str){
		str = str.toLowerCase();
			var cyr2latChars = new Array(
					['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
					['д', 'd'],  ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
					['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
					['м', 'm'],  ['н', 'n'], ['о', 'o'], ['п', 'p'],  ['р', 'r'],
					['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
					['х', 'h'],  ['ц', 'c'], ['ч', 'ch'],['ш', 'sh'], ['щ', 'shch'],
					['ъ', ''],  ['ы', 'y'], ['ь', ''],  ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],

					['А', 'A'], ['Б', 'B'],  ['В', 'V'], ['Г', 'G'],
					['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'],  ['Ж', 'ZH'], ['З', 'Z'],
					['И', 'I'], ['Й', 'Y'],  ['К', 'K'], ['Л', 'L'],
					['М', 'M'], ['Н', 'N'], ['О', 'O'],  ['П', 'P'],  ['Р', 'R'],
					['С', 'S'], ['Т', 'T'],  ['У', 'U'], ['Ф', 'F'],
					['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
					['Ъ', ''],  ['Ы', 'Y'],
					['Ь', ''],
					['Э', 'E'],
					['Ю', 'YU'],
					['Я', 'YA'],

					['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'],
					['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'],
					['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'],
					['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
					['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'],
					['z', 'z'],

					['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'],['E', 'E'],
					['F', 'F'],['G', 'G'],['H', 'H'],['I', 'I'],['J', 'J'],['K', 'K'],
					['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'],['P', 'P'],
					['Q', 'Q'],['R', 'R'],['S', 'S'],['T', 'T'],['U', 'U'],['V', 'V'],
					['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],

					[' ', '-'],['0', '0'],['1', '1'],['2', '2'],['3', '3'],
					['4', '4'],['5', '5'],['6', '6'],['7', '7'],['8', '8'],['9', '9'],
					['-', '-']

	    );

	    var newStr = new String();

	    for (var i = 0; i < str.length; i++) {

	        ch = str.charAt(i);
	        var newCh = '';

	        for (var j = 0; j < cyr2latChars.length; j++) {
	            if (ch == cyr2latChars[j][0]) {
	                newCh = cyr2latChars[j][1];

	            }
	        }
	        newStr += newCh;

	    }
	    return newStr.replace(/[-]{2,}/gim, '-').replace(/\n/gim, '');
	};

	utils.getCookie = function(name){
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	};

	utils.setCookie = function(name, value, options){
	  options = options || {};

	  var expires = options.expires;

	  if (typeof expires == "number" && expires) {
	    var d = new Date();
	    d.setTime(d.getTime() + expires * 1000);
	    expires = options.expires = d;
	  }
	  if (expires && expires.toUTCString) {
	    options.expires = expires.toUTCString();
	  }

	  value = encodeURIComponent(value);

	  var updatedCookie = name + "=" + value;

	  for (var propName in options) {
	    updatedCookie += "; " + propName;
	    var propValue = options[propName];
	    if (propValue !== true) {
	      updatedCookie += "=" + propValue;
	    }
	  }

	  document.cookie = updatedCookie;
    };

	if (window.moment) utils.moment = window.moment;

	if (window._) _.extend(_, utils);
	else window._ = utils;

	app.utils = window._;

})(app, app.utils);
