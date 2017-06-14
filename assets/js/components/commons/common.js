(function($){

	/* --- App interface --- */
	app.define("config");
	app.define("effects");
	app.define("sizes");
	app.define("utils");
	app.define("plugins");
	app.define("device");
	app.define("events");
	app.define("loader");
	app.define("$dom");

	/* --- Root blocks --- */
	app.$dom = {
		html: $('html'),
		body: $('body'),
		document: $(document),
		window: $(window),
		root: $('#app')
	};

	/* --- Events vars --- */
	app.events = {
		click: document && 'ontouchstart' in document.documentElement ? 'tap' : 'click'
	};

	/* --- Keys vars --- */
	app.keys = {
		LEFT: 37,
	    UP: 38,
	    RIGHT: 39,
	    DOWN: 40,
	    DEL: 8,
	    TAB: 9,
	    RETURN: 13,
	    ENTER: 13,
	    ESC: 27,
	    PAGEUP: 33,
	    PAGEDOWN: 34,
	    SPACE: 32
	};

	window.KEY = app.keys;

	/* --- Prefixed styles --- */
	app.prefixed = {
		'transform': Modernizr.prefixed('transform'),
		'transform-origin': Modernizr.prefixed('transformOrigin'),
		'transition-duration': Modernizr.prefixed('transitionDuration')
	};

	$$ = window.jQuery;

	if (window.moment) moment.locale('ru');

	window.Animation = {};

	/*** --- Dataset helper --- ***/
	$.fn.api = function(key){
		return this.data(key) ? this.data(key) : this.data(key, {}).data(key);
	};

})($);
