var request = require('request');
var Promise = require('./promise');

exports.post = function(url, options) {
	return Promise.asPromise(request, request.post, url, options);
}

exports.put = function(url, options) {
	return Promise.asPromise(request, request.put, url, options);
}

exports.get = function(url, options) {
	return Promise.asPromise(request, request.get, url, options);
}

exports.delete = function(url, options) {
	return Promise.asPromise(request, request.delete, url, options);
}