var db = require('../lib/db');
var cons = require('../lib/cons');

exports.openSlot = function(slotId) {
	console.log('Setting slot ' + slotId + ' to OPEN');
	return db.update('slots', {id: slotId}, {open: true});
}

exports.closeSlot = function(slotId, bikeId) {
	return db.update('slots', {id: slotId}, {open: false, bikeId: bikeId});
}

exports.withdrawBike = function(slotId) {
	return db.update('slots', {id: slotId}, {bikeId: null});
}

exports.get = function(id) {
	return db.findOne('slots', {id: id});
}

exports.getWithStation = function(id) {
	return db.findOne('slots', {id: id})
		.then(function(slot) {
			return db.findOne('stations', {id: slot.stationId})
				.then(function(station) {
					slot.station = station;

					return slot;
				});
		});
}