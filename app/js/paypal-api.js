/**
 * [description]
 * @param  {[type]} window   [description]
 * @param  {[type]} document [description]
 * @return {[type]}          [description]
 */
(function (document) {
	"use strict";

	var paypalApi = {};
	var helper = {};

	/****************************************************************************************************\
	********************************************PAYPAL METHODS********************************************
	\****************************************************************************************************/

	/**
	 * [accessToken description]
	 * @type {Object}
	 */
	paypalApi.accessToken = null;
	
	/**
	 * [getToken description]
	 * @param  {[type]} baseUrl [description]
	 * @return {[type]}         [description]
	 */
	paypalApi.getToken = function (baseUrl) {
		var url  = helper.getUrl("/paypal/gettoken");

		helper.ajax({
			url: url,
			type: "GET",
			callback: function (response) {
				var parsedResponse = JSON.parse(response.responseText);
				paypalApi.accessToken = parsedResponse.token_type + " " + parsedResponse.access_token;
			},
			headers: [
				{'header': 'X-Requested-With', 'value': 'XMLHttpRequest'},
				{'header': 'Content-Type', 'value': 'application/x-www-form-urlencoded'}
			]
		})
	};

	paypalApi.sendPayment = function () {
		var url  = helper.getUrl("/paypal/payment");
		var cancelUrl = helper.getUrl("/guide/pay_paypal/curl?cancel=true");
		var returnUrl = helper.getUrl("/guide/pay_paypal/curl?success=true");

		helper.ajax({
			url: url,
			type: "POST",
			data: { 
				"transaction" :	{
					"transactions": [{
						"amount": {
							"currency":"USD",
							"total":"12"
						},
						"description":"creating a payment"
					}],
					"payer": {
						"payment_method":"paypal"
					},
					"intent":"sale",
					"redirect_urls": {
						"cancel_url": cancelUrl,
						"return_url": returnUrl
					}
				}
			},
			callback: function (response) {
				var parsedResponse = JSON.parse(response.responseText);
				console.log(parsedResponse);
			}
		})
	};


	/****************************************************************************************************\
	********************************************HELPER METHODS********************************************
	\****************************************************************************************************/

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
		var headers 	= typeof param.headers !== 'undefined' ? param.headers  : [];
		var user 		= typeof param.user !== 'undefined' ? param.user  : null;
		var password	= typeof param.password !== 'undefined' ? param.password  : null;

		var request = new XMLHttpRequest();
		request.open(type, url, true, user, password);

		if (type.toLowerCase() == "post") {
			request.setRequestHeader("conte", "application/json");
			request.setRequestHeader("content-type", "application/json");

			var data = JSON.stringify(param.data);
		}

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

	helper.encodeFormData = function (data) {

	}

	/**
	 * [getUrl description]
	 * @param  {[type]} path [description]
	 * @return {[type]}      [description]
	 */
	helper.getUrl = function (path) {
		// Get the window location
		var l = window.location;

		var protocol = l.protocol;
		var host = l.hostname;
		var port = l.port;
		var path = typeof path !== 'undefined' ? path : l.pathname;
		var hash = l.hash;

		var url = protocol + "//" + host + (port !== "" ? ":" + port : null) + path + hash;

		return url;
	};

	/**
	 * Register api
	 */
	window.paypalApi = paypalApi;
	window.paypalHelper = helper;
})(document);