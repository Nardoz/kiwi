var db = require('../lib/db');
var socket = require('../lib/socket');
var stationService = require('./station');

exports.openSlot = function(slot) {
	console.log('Setting slot ' + slot.id + ' to OPEN');
	return db.update('slots', {id: slot.id}, {open: true})
		.then(function() {
			socket.notify('slot.open', {id: slot.id});
		});

}

exports.closeSlot = function(slot, bikeId) {
	return db.update('slots', {id: slot.id}, {open: false, bikeId: bikeId})
		.then(function() {
			socket.notify('slot.close', {id: slot.id, bikeId: bikeId});
		});
}

exports.withdrawBike = function(slot) {
	return db.update('slots', {id: slot.id}, {bikeId: null})
		.then(function() {
			socket.notify('slot.withdraw', {id: slot.id});
		});
}

exports.get = function(id) {
	return db.findOne('slots', {id: id});
}

exports.getWithStation = function(id) {
	return db.findOne('slots', {id: id})
		.then(function(slot) {
			return stationService.get(slot.stationId)
				.then(function(station) {
					slot.station = station;

					return slot;
				});
		});
}