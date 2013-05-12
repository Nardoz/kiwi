var db = require('../lib/db');
var cons = require('../lib/cons');

exports.get = function(id) {
	return db.findOne('stations', {id: id});
};

exports.updateIP = function(stationId, ip) {
	return exports.get(stationId)
		.then(function(station) {
			return db.update('stations', {id: station.id}, {ip: ip})
				.then(function() {
					console.log('Updated station "' + station.name + '" IP address to ' + ip);
				});
		});
};