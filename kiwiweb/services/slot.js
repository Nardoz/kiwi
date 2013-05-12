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