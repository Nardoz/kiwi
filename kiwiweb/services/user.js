var db = require('../lib/db');
var cons = require('../lib/cons');

exports.getByPhonenumber = function(phonenumber) {
	return db.findOne('users', {cel: phonenumber});
}

exports.get = function(id) {
	return db.findOne('users', {id: id});
}