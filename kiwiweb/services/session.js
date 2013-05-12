var db = require('../lib/db');
var CONST = require('../lib/cons');

exports.getOpenSessionForBike = function(bikeId) {
	return db.findOne('sessions', {bikeId: bikeId, status: {$not: { $eq: CONST.SESSION.STATUS.FINISHED} } } );
}

exports.discardSession = function(session) {
	// Slot timed out. User didn't take the bike. Removing the "reserved" session
	console.log('Slot ' + slotId + ' timed out and closed. Removing the session.');
	return db.remove('sessions', {id: session.id});		
}

exports.finishSession = function(session) {
	// Bike from an active session was returned to this slot, finishing the session
	console.log('Slot ' + slotId + ' received bike ' + bikeId + ' from user ' + session.userId + '. Finishing the session.');
	return db.update('sessions', {id: session.id}, {status: CONST.SESSION.STATUS.FINISHED, dateTo: Date.now(), slotTo: slotId});
}

exports.updateSessionForClosedSlot = function(slotId, bikeId) {
	if(bikeId) {
		return exports.getOpenSessionForBike(bikeId)
			.then(function(session) {
				if(!session) throw Error('Session not found');

				if(session.status === CONST.SESSION.STATUS.RESERVED) {
					return exports.discardSession(session);		
				} else {
					return exports.finishSession(session);
				}
		});
	} else {
		console.log('Slot ' + slotId + ' closed without a bike, mmm...that is not cool man!');
		return Error('Invalid slot status. Slot ' + slotId + ' closed without a bike');
	}
}

exports.activateSession = function(slotId) {
	return db.update('sessions', {slotId: slotId, status: CONST.SESSION.STATUS.RESERVED}, {status: CONST.SESSION.STATUS.ACTIVE, dateFrom: Date.now()});
}

exports.createSession = function(userId, bikeId, slotId) {
	var session = {
		userId: userId,
		bikeId: bikeId,
		slotFrom: slotId,
		status: CONST.SESSION.STATUS.RESERVED,
		dateTo: null  
	};

	return db.insert('sessions', session);
};