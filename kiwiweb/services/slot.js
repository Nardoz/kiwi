var db = require('../lib/db');
var cons = require('../lib/cons');

exports.openSlot = function(slot) {
	console.log('Setting slot ' + slot.id + ' to OPEN');
	return db.update('slots', {id: slot.id}, {open: true});
}

exports.closeSlot = function(slot, bikeId) {
	return db.update('slots', {id: slot.id}, {open: false, bikeId: bikeId});
}

exports.withdrawBike = function(slot) {
	return db.update('slots', {id: slot.id}, {bikeId: null});
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