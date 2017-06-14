(function(loader){
	// history
	loader.history = [];
	// {fn} load resources
	loader.resources = function(resources, complete, callback){
		// check callbacks
		complete = complete || $.noop;
		callback = callback || $.noop;
		// unchached resources
		var unchached = [];
		for (var i=0; i<resources.length; i++) {
			if (loader.history.indexOf(resources[i])<0) unchached.push(resources[i]);
		};
		// if resources is empty
		if (!unchached.length) return complete();
		// load
		Modernizr.load({
			load: unchached,
			callback: function(url){
				loader.history.push(url);
				callback();
			},
			complete: complete
		});
	};
	// {fn} load images
	loader.images = function($scope, complete, callback){
		var loaded = 0;
		// check callbacks
		complete = complete || $.noop;
		callback = callback || $.noop;
		// init plugin
		$scope.imagesLoaded({ background: '.bg-cover' }).always(complete).progress(function(instance){
			loaded++;
			callback(loaded, instance.images.length)
		});
	}
})(app.loader);

(function(sizes, $dom){
	// {fn} update sizes
	var updateSizes = function(){
		sizes.width = $dom.window.width();
		sizes.height = parseInt(window.innerHeight,10);
	};
	// {event} window resize
	$dom.window.on('resize.app', updateSizes);
	// init
	updateSizes();
})(app.sizes, app.$dom);

(function(device, $dom, _){

	/* --- Mobile --- */
	device.support = Modernizr;

	/* --- Mobile --- */
	device.isMobile = device.support.touch;

	if ($dom.root.attr("demo") == "true"){
		app.demo = true;

		if ($dom.window.width() < 1025){
			device.isMobile = true;
			$dom.html.removeClass("m-no-touch").addClass("m-touch");
		}
	}
	$dom.html.addClass(device.isMobile ? 'd-mobile' : 'd-no-mobile');

	/* --- Retina --- */
	device.isRetina = (window.devicePixelRatio && window.devicePixelRatio>1);
	$dom.html.addClass(device.isRetina ? 'd-retina' : 'd-no-retina');

	/* --- sizeCheck --- */
	var sizeCheck = function(){
		var width = $dom.window.width();
		device.isPhone = (width < 768);
		device.isTablet = (width < 1025 && width > 767);
		device.orientation = (device.isTablet && width < 1025 && width > 991 || device.isPhone && width > 480 ? "landscape" : "portrait");
		$dom.html
		.addClass(device.isPhone ? 'd-phone' : 'd-no-phone')
		.removeClass(device.isPhone ? 'd-no-phone' : 'd-phone')
		.addClass(device.isTablet ? 'd-tablet' : 'd-no-tablet')
		.removeClass(device.isTablet ? 'd-no-tablet' : 'd-tablet')
		.addClass(device.orientation === "landscape" ? 'r-landscape' : 'r-portrait')
		.removeClass(device.orientation !== "landscape" ? 'r-landscape' : 'r-portrait');
		device.is = device.isPhone ? 'phone' : (device.isTablet ? 'tablet' : 'desktop');
	};
	$dom.window.on((device.isMobile ? 'orientationchange' : 'resize') + '.sizeCheck', sizeCheck);
	sizeCheck();

	device.ua = navigator.userAgent;

	if (navigator.userAgent.match(/(iPhone)/i)) device.isPhone = true;

	/* --- iOS --- */
	if (navigator.userAgent.match(/iPad/i)) {
		$dom.html.addClass('d-ipad');
		device.isIPad = true;
	};
	if (navigator.userAgent.match(/(iPhone|iPod touch)/i)) {
		$dom.html.addClass('d-iphone');
		device.isIPhone = true;
	};
	if (navigator.userAgent.match(/(iPad|iPhone|iPod touch)/i)) {
		$dom.html.addClass('d-ios');
		device.isIOS = true;
		var expr = navigator.userAgent.match(/.*CPU.*OS (\d)_(\d)/i);
		device.verOS = expr && expr[1] ? expr[1] + (expr[2] ? "." + expr[2] : "") : false;
	}
	else {
		$dom.html.addClass('d-no-ios');
	};
	if (navigator.userAgent.match(/.*CPU.*OS 7_\d/i)) {
		$dom.html.addClass('d-ios7');
		device.isIOS7 = true;
	};
	if (navigator.userAgent.match(/Android/i)) {
		$dom.html.addClass('d-android');
		device.isAndroid = true;
		var expr = navigator.userAgent.match(/Android (\d)\.(\d)/i);
		device.verOS = expr && expr[1] ? expr[1] + (expr[2] ? "." + expr[2] : "") : false;
	};

	if (app.device.isMobile){
		device.os = device.isAndroid ? 'android' : (device.isIOS ? 'ios' : 'unknown');
	}

	/* --- iPad (for fix wrong window height) --- */
	if ($dom.html.hasClass('d-ipad d-ios7')) {
		$dom.window.on('resize orientationchange focusout', function(){
			window.scrollTo(0,0);
		});
	};

	device.isWin = navigator.platform.indexOf("Win") > -1;
	device.isMac = navigator.platform.indexOf("Mac") > -1;
	device.isLinux = navigator.platform.indexOf("Linux") > -1;

	$dom.html.addClass(device.isMac ? 'd-macOS' : 'd-no-macOS');

	device.platform = device.isWin ? 'win' : (device.isMac ? 'mac' : (device.isLinux ? 'linux' : 'unknown'));

	/* --- Chrome --- */
	device.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	$dom.html.addClass(device.isChrome ? 'd-chrome' : 'd-no-chrome');

	/* --- Safari --- */
	device.isSafari = !device.isChrome && navigator.userAgent.toLowerCase().indexOf('safari') > -1;
	$dom.html.addClass(device.isSafari ? 'd-safari' : 'd-no-safari');

	/* --- Firefox --- */
	device.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	$dom.html.addClass(device.isFirefox ? 'd-firefox' : 'd-no-firefox');

	/* --- Fix click onTouch device --- */
	if (device.isMobile && window.FastClick && 'addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
			FastClick.attach(document.body);
		}, false);
	}

	app.device.get = function(){
		return _.extend(_.omit(app.device, ['get', 'support']), {
			screen: app.sizes
		});
	}

})(app.device, app.$dom, app.utils);
