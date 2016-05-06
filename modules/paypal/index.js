/**
 * Dependencies
 * @type {[type]}
 */
var XMLHttpRequest 	= require("xmlhttprequest").XMLHttpRequest
var btoa 			= require("btoa");


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
		headers: {
			header: "Accept",
			value: "application/json"
		},
		data: {grant_type: "client_credentials"}
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

	// FIXME : define all route
	// ...
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

	helper.ajax({
		url: url + 'config.json',
		type: "GET",
		callback: function (request) {
			var data = JSON.parse(request.responseText);
			console.log("\033[0;34m[paypal] Config loaded with success\033[0m");
			paypal.config = data;
			
			// Get the oauth token
			paypal.oauth({
				endPoint: paypal.urls.auth.url,
				user: paypal.config.clientID,
				password: paypal.config.secret
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
	var endPoint 	= typeof param.endPoint !== 'undefined' ? param.endPoint : null;
	var user 		= typeof param.user !== 'undefined' ? param.user : null;
	var password 	= typeof param.password !== 'undefined' ? param.password : null;

	helper.ajax({
		url: endPoint,
		type: 'POST',
		data: {},
		callback: function (request) {
			console.log(JSON.parse(request.responseText));
		},
		data: {
			grant_type: 'client_credentials'
		},
		user: user,
		password: password
	});
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
