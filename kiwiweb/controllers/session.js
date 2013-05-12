var db = require('../lib/db');
var Promise = require('../lib/promise');
var CONS = require('../lib/cons')
var sessionService = require('../services/session');

exports.getById = function(req, res, next) {
	Promise.all([
		db.findOne('sessions', {id: parseInt(req.params.id, 10)})
	])
	.spread(function(session){
		res.render('session', { title: 'Session Details ', session: session });
	})
	.done();
};

