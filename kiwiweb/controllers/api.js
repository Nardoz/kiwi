var db = require('../lib/db');
var constants = require('../lib/constants');

function handle(promise, res, next) {
	promise
	.then(function(result) {
		res.json(result);
	})
	.fail(function(err) {
		 return next(err);
	})
	.done();
}

exports.createSession = function(req, res, next) {
	var session = {
		userId: req.params.userId,
		bikeId: req.body.bikeId,
		slotFrom: req.body.slotFrom,
		status: constants.SESSION_STATUS_RESERVED,
		dateTo: null  
	};

	db.insert('sessions', session).then(function() {
		res.ok();
	});
};

exports.updateSlot = function(req, res, next) {
	var slotId = req.params.slotId;
	var bikeId = req.body.bikeId;
	var isOpen = req.body.open;
	
	if(isOpen) {
		openSlot(slotId)
		.then(function() {
			res.ok();
		});
		return;		
	} else {
		/*closeSlot(slotId);

		updateSession(bikeId, slotId)*/
	}
};

function openSlot(slotId) {
	return db.update('slots', {id: slotId}, {open: true});
}

function closeSlot(slotId, bikeId) {
	return db.update('slots', {id: slotId}, {open: false, bikeId: bikeId});
}

function updateSession(slotId, bikeId) {
	/*if(bikeId) {
		db.find('sessions', {slotId: slotId, })
	} else {
		return db.update('sessions', {slotId: slotId, status: constants.SESSION_STATUS_RESERVED}, {status: constants.SESSION_STATUS_ACTIVE, dateFrom: Date.now()});
	}*/
}