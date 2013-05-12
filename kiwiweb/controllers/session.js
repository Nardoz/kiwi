var db = require('../lib/db');
var Promise = require('../lib/promise');
var CONS = require('../lib/cons')
var sessionService = require('../services/session');

exports.getById = function(req, res, next) {
	Promise.all([
		db.findOne('sessions', {id: parseInt(req.params.id, 10)})
	])
	.spread(function(session){
		db.find('slots', { id : { $in : [session.slotFrom, session.slotTo]}})
		.then(function (slots) {
			db.find('stations', { id : { $in : [slots[0].stationId, slots[1].stationId]}})
			.then(function (stations) {	
				console.log("Station", stations);
				res.render('session', {
					title: 'Session Details: ' + stations.length,
					session: session,
					stations : stations 
				});

			})
			.done();
		})
		.done();

	})
	.done();
};

