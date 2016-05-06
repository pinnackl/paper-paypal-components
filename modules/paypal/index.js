/**
 * Dependencies
 * @type {[type]}
 */
var XMLHttpRequest 	= require("xmlhttprequest").XMLHttpRequest
var btoa 			= require("btoa");
var url 			= require('url');


/**
 * [paypal description]
 * @type {Object}
 */
var paypal = {};
var helper = {};

paypal.version = "0.0.1";
paypal.config = {
	'clientID': '',
	'secret': ''
};
paypal.urls = {
	auth: {
		url: "https://api.sandbox.paypal.com/v1/oauth2/token",
		headers: [
			{
				header: "Accept",
				value: "application/json"
			}
		],
		data: {grant_type: "client_credentials"}
	},
	payment: {
		url: "https://api.sandbox.paypal.com/v1/payments/payment",
		headers: [
			{
				header: "Content-Type",
				value: "application/json"
			}
		],
		data: {}
	}
};

/**
 * Simple test method to test the node module
 * @return void
 */
paypal.init = function (app, dir) {
	console.log("[paypal] Paypal module ready to use");
	app.get('/config.json', function (req, res) {
		res.sendFile(dir + '/config.json');
	});

	app.get('/paypal/gettoken', function (req, res) {
		var url = req.protocol + '://' + req.get('host');
		paypal.getConfig(url, req, res);
	});

	app.post('/paypal/payment', function (req, res) {

		var url_parts = url.parse(req.url, true);
	
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({plop: "plop"}));

		// paypal.payment({});
	});

	// FIXME : define all route
	// ...
};

/**
 * [getConfig description]
 * @return {[type]} [description]
 */
paypal.getConfig = function (url, req, res) {
	var url = typeof url !== 'undefined' ?  url : null;
	var req = typeof req !== 'undefined' ?  req : null;
	var res = typeof res !== 'undefined' ?  res : null;

	if (null) {
		return;
	}

	// FIXME: Assure the the url is the good one
	helper.ajax({
		url: url + '/config.json',
		type: "GET",
		callback: function (request) {
			var data = JSON.parse(request.responseText);
			console.log("\033[0;34m[paypal] Config loaded with success\033[0m");
			paypal.config = data;
			
			// Get the oauth token
			// And return the json response to the api
			paypal.oauth({
				endPoint: paypal.urls.auth.url,
				user: paypal.config.clientID,
				password: paypal.config.secret,
				callback: function (request) {
					if (JSON.parse(request.responseText)) {
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify(JSON.parse(request.responseText)))
					}
				}
			});
		}
	});
};

/**
 * [showConfig description]
 * @return {[type]} [description]
 */
paypal.showConfig = function () {
	console.log(paypal.config);
};

/**
 * [oauth description]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
paypal.oauth = function (param) {
	var endPoint 	= typeof param.endPoint !== 'undefined' ? param.endPoint : paypal.urls.auth.url;
	var user 		= typeof param.user !== 'undefined' ? param.user : null;
	var password 	= typeof param.password !== 'undefined' ? param.password : null;
	var callback 	= typeof param.callback !== 'undefined' ? param.callback : function () {};

	helper.ajax({
		url: endPoint,
		type: 'POST',
		callback: callback,
		data: {
			grant_type: 'client_credentials'
		},
		user: user,
		password: password
	});
};

/**
 * [payment description]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
paypal.payment = function (param) {
	var endPoint 	= typeof param.endPoint !== 'undefined' ? param.endPoint : paypal.urls.payment.url;
	var headers		= typeof param.headers !== 'undefined' ? param.headers : paypal.urls.payment.headers;

	console.log(endPoint, headers);
};

/**
 * [ajax description]
 * @param  {[type]} url
 * @param  {[type]} type
 * @param  {[type]} data
 * @param  {[type]} callback
 * @param  {[type]} headers
 * @return {[type]}
 */
helper.ajax = function (param) {
	var url 		= typeof param.url !== 'undefined' ? param.url  : "/";
	var type 		= typeof param.type !== 'undefined' ? param.type  : "GET";
	var data 		= typeof param.data !== 'undefined' ? helper.encodeData(param.data)  : helper.encodeData({});
	var callback 	= typeof param.callback !== 'undefined' ? param.callback  : function () {};
	var headers 	= typeof param.headers !== 'undefined' ? param.headers  : [{'header': 'X-Requested-With', 'value': 'XMLHttpRequest'}, {'header': 'Content-Type', 'value': 'application/x-www-form-urlencoded'}];
	var user 		= typeof param.user !== 'undefined' ? param.user  : null;
	var password	= typeof param.password !== 'undefined' ? param.password  : null;

	var request = new XMLHttpRequest();
	request.open(type, url, true, user, password);

	for (var i = 0; i < headers.length; i++) {
		request.setRequestHeader(headers[i].header, headers[i].value);
	};

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			callback(request);
		} else {
			// Error!
			console.log("error");
			console.log(JSON.parse(request.responseText));
		}
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send(data);
};

/**
 * [encodeData description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
helper.encodeData = function (data) {
    var queryString = Object.keys(data).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(data[key]);
        }).join('&');

    return encodeURI(queryString);
}

/**
 * Module exports.
 * @public
 */
exports.version 	= paypal.version;
exports.init 		= paypal.init;
exports.login 		= paypal.login;
exports.getConfig 	= paypal.getConfig;
exports.showConfig 	= paypal.showConfig;
