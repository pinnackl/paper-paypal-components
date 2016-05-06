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
})(document);