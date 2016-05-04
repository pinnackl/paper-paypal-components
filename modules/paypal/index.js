/**
 * Dependencies
 * @type {[type]}
 */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest


/**
 * [paypal description]
 * @type {Object}
 */
var paypal = {};

paypal.version = "0.0.1";
paypal.config = {
	'clientID': '',
	'secret': ''
};
paypal.urls = [{}];

/**
 * Simple test method to test the node module
 * @return void
 */
paypal.init = function (app, dir) {
	console.log("[paypal] Paypal module ready to use");
	app.get('/config.json', function (req, res) {
		res.sendFile(dir + '/config.json');
	});
};

/**
 * [getConfig description]
 * @return {[type]} [description]
 */
paypal.getConfig = function (url) {
	var url = typeof url !== 'undefined' ?  url : null;
	if (null) {
		return;
	}

	var request = new XMLHttpRequest();
	request.open('GET', url + 'config.json', true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			var data = JSON.parse(request.responseText);
			console.log("\033[0;34m[paypal] Config loaded with success\033[0m");
			paypal.config = data;

			// paypal.showConfig();
		} else {
			// Error!
			console.log("error");
		}
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send();
};

paypal.showConfig = function () {
	console.log(paypal.config);
};

/**
 * [login description]
 * @return {[type]} [description]
 */
paypal.login = function () {
	console.log("[paypal] Login method");
};

/**
 * Module exports.
 * @public
 */
exports.version 	= paypal.version;
exports.init 		= paypal.init;
exports.login 		= paypal.login;
exports.getConfig 	= paypal.getConfig;
exports.showConfig 	= paypal.showConfig;
