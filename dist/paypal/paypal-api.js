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
	 * [approvalUrl description]
	 * @type {Object}
	 */
	paypalApi.approvalUrl = null;
	
	/**
	 * [getToken description]
	 * @param  {[type]} baseUrl [description]
	 */
	paypalApi.getToken = function (callback) {
		var callback = typeof callback !== 'undefined' ? callback : () => {};

		var url  = helper.getUrl("/paypal/gettoken");

		helper.ajax({
			url: url,
			type: "GET",
			callback: function (response) {
				var parsedResponse = JSON.parse(response.responseText);
				paypalApi.accessToken = parsedResponse.token_type + " " + parsedResponse.access_token;

				callback(paypalApi.accessToken);
			},
			headers: [
				{'header': 'X-Requested-With', 'value': 'XMLHttpRequest'},
				{'header': 'Content-Type', 'value': 'application/x-www-form-urlencoded'}
			]
		})
	};

	/**
	 * [sendPayment description]
	 * @param  {[object]} params [Object containing parameters to send to PayPal]
	 * 		{[string]} price 
	 * 		{[string]} currency 
	 * 		{[string]} description 
	 * 		{[string]} cancelUrl [The helper will build URL from current domain name. Only the URI is needed]
	 * 		{[string]} returnUrl [The helper will build URL from current domain name. Only the URI is needed]
	 * 		{[string]} callback  [The actions to perform after the payment succeed]
	 */
	paypalApi.sendPayment = function (params) {
		if (typeof params == "undefined") {
			console.error("No argument passed");
			return false;
		}

		var price = typeof params.transaction.total !== 'undefined' ? params.transaction.total  : false;
		var currency = typeof params.transaction.currency !== 'undefined' ? params.transaction.currency  : false;
		var description = typeof params.transaction.description !== 'undefined' ? params.transaction.description  : false;

		if (!price || !currency || !description) {
			console.error("Argument(s) missing");
			return false;
		}

		var cancelUrl = typeof params.cancelUrl !== 'undefined' ? helper.getUrl(params.cancelUrl) : helper.getUrl("/?cancel=true");
		var returnUrl = typeof params.returnUrl !== 'undefined' ? helper.getUrl(params.returnUrl) : helper.getUrl("/?success=true");
		var callback = typeof params.callback !== 'undefined' ? params.callback  : () => {};

		var url  = helper.getUrl("/paypal/payment");

		helper.ajax({
			url: url,
			type: "POST",
			data: { 
				"transaction" :	{
					"transactions": [{
						"amount": {
							"currency": currency,
							"total": price.toFixed(2)
						},
						"description": description
					}],
					"payer": {
						"payment_method":"paypal"
					},
					"intent":"sale",
					"redirect_urls": {
						"cancel_url": cancelUrl,
						"return_url": returnUrl
					}
				},
			},
			callback: function (response) {
				var parsedResponse = JSON.parse(response.responseText);
				var aLinks = parsedResponse.links;
				for (var i = 0; i < aLinks.length; i++) {
				    if (aLinks[i].rel == "approval_url") {
						paypalApi.approvalUrl = aLinks[i].href;	
						break;			    	
				    }
				}
				window.location.href = paypalApi.approvalUrl;
			},
			headers: [{
				header: 'Authorization',
				value: paypalApi.accessToken
			}]
		})
	};

	paypalApi.executePayment = function (accessToken, callback) {
		var callback = typeof callback !== 'undefined' ? callback : function() {};

		if (!accessToken || !paypalApi.accessToken) {
			console.error("Argument(s) missing");
			return false;
		}

		var accessToken = accessToken || paypalApi.accessToken;

		var url  = helper.getUrl("/paypal/execute");
		var query = (window.location.search || '?').substr(1);
        var map = {};
	    query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
	        (map[key] = map[key] || []).push(value);
	    });

		helper.ajax({
			url: url,
			type: "POST",
			data: { 
				"payer_id" : map.PayerID[0],
				'paymentId' : map.paymentId[0],
			},
			callback: function (response) {
				var parsedResponse = JSON.parse(response.responseText);
				paypalApi.paymentId = parsedResponse.id;
				paypalApi.state = parsedResponse.state;

				console.log(paypalApi.accessToken);
				callback();
			},
			failure: function (response) {
				callback();
			},
			headers: [{
				header: 'Authorization',
				value: paypalApi.accessToken
			}]
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
	 * @param  {[type]} failure
	 * @param  {[type]} headers
	 * @return {[type]}
	 */
	helper.ajax = function (param) {
		var url 		= typeof param.url !== 'undefined' ? param.url  : "/";
		var type 		= typeof param.type !== 'undefined' ? param.type  : "GET";
		var data 		= typeof param.data !== 'undefined' ? helper.encodeData(param.data)  : helper.encodeData({});
		var callback 	= typeof param.callback !== 'undefined' ? param.callback  : function () {};
		var failure 	= typeof param.failure !== 'undefined' ? param.failure  : function () {};
		var headers 	= typeof param.headers !== 'undefined' ? param.headers  : [{'header': 'X-Requested-With', 'value': 'XMLHttpRequest'}];
		var user 		= typeof param.user !== 'undefined' ? param.user  : null;
		var password	= typeof param.password !== 'undefined' ? param.password  : null;

		var request = new XMLHttpRequest();
		request.open(type, url, true, user, password);

		for (var i = 0; i < headers.length; i++) {
			request.setRequestHeader(headers[i].header, headers[i].value);
		};

		if (data !== "" && type.toLowerCase() == "post") {
			request.setRequestHeader("conte", "application/json");
			request.setRequestHeader("content-type", "application/json");

			var data = JSON.stringify(param.data);
		}

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				callback(request);
			} else {
				// Error!
				console.log(request.status, " error: ", request.responseText);
				failure(request);
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