var db = require('../lib/db');
var socket = require('../lib/socket');
var CONST = require('../lib/cons');
var _ = require('underscore');

exports.getOpenSessionForBike = function(bikeId) {
	return db.find('sessions', { bikeId: parseInt(bikeId) } )
		.then(function(s){
			return _.find(s,function(i){
				return (i.status!==CONST.SESSION.STATUS.FINISHED)
			});
		});
}

exports.discardSession = function(session) {
	// Slot timed out. User didn't take the bike. Removing the "reserved" session
	
	return db.remove('sessions', {id: session.id})
		.then(function() {
			socket.notify('session.discard', {id: session.id});
		});	
}

exports.finishSession = function(session, slot) {
	// Bike from an active session was returned to this slot, finishing the session
	console.log('Slot ' + slot.id + ' received bike ' + session.bikeId + ' from user ' + session.userId + '. Finishing the session.');
	return db.update('sessions', {id: session.id}, {status: CONST.SESSION.STATUS.FINISHED, dateTo: Date.now(), slotTo: slot.id})
		.then(function() {
			socket.notify('session.finish', {id: session.id});
		});
}

exports.updateSessionForClosedSlot = function(bikeId, slot) {
	if(bikeId) {
		return exports.getOpenSessionForBike(bikeId)
			.then(function(session) {
				if(!session) throw Error('Session not found');

				if(session.status === CONST.SESSION.STATUS.RESERVED) {
					console.log('Slot ' + slot.id + ' timed out and closed. Removing the session.');
					return exports.discardSession(session);		
				} else {
					return exports.finishSession(session, slot);
				}
		});
	} else {
		console.log('Slot ' + slot.id + ' closed without a bike, mmm...that is not cool man!');
		return Error('Invalid slot status. Slot ' + slot.id + ' closed without a bike');
	}
}

exports.activateSession = function(slot) {
	return db.findOne('sessions', {slotFrom: slot.id, status: CONST.SESSION.STATUS.RESERVED})
		.then(function(session) {
			if(!session) throw Error('Session not found');

			return db.update('sessions', {id: session.id}, {status: CONST.SESSION.STATUS.ACTIVE, dateFrom: Date.now()})
				.then(function() {
					socket.notify('session.activate', {id: session.id});
				});
		});
		
}

exports.createSession = function(user, slot) {
	var session = {
		userId: user.id,
		bikeId: slot.bikeId,
		slotFrom: slot.id,
		status: CONST.SESSION.STATUS.RESERVED
	};

	return db.generateId('sessions')
		.then(function(id) {
			session.id = id;
			return db.insert('sessions', session);
		});
};