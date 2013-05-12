var cons = require('../lib/cons');
var sessionService = require('../services/session');
var slotService = require('../services/slot');
var userService = require('../services/user');

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

exports.createSessionByUserId = function(req, res, next) {
	var userId = req.params.userId;
	var slotId = req.body.slotId;

	console.log('Creating session for user ' + userId + ' and slot ' + slotId);

	var promise = userService.get(userId).then(function(user) {
		return createSession(user, slotId);
	});

	handleResponse(promise, res, next);
};

exports.createSessionByPhonenumber = function(req, res, next) {
	var phoneNumber = req.params.number;
	var slotId = req.body.slotId;

	console.log('Creating session for user with phone number ' + phoneNumber + ' and slot ' + slotId);

	var promise = userService.getByPhonenumber(phoneNumber).then(function(user) {
		console.log('Found user ' + user.id + ' for phone number ' + phoneNumber);
		return createSession(user, slotId);
	});

	handleResponse(promise, res, next);
};

function createSession(user, slotId) {
	return slotService.getWithStation(slotId)
		.then(function(slot) {
			return sessionService.createSession(user, slot);	
		})
		.then(function() {
			// Llamar a estacion slot.station.ip
		});
}

exports.openSlot = function(req, res, next) {
	var slotId = req.params.slotId;
	console.log('Slot ' + slotId + ' open');

	var promise = slotService.get(slotId).then(function(slot) {
		return slotService.openSlot(slot);
	});
	
	handleResponse(promise, res, next);
};

exports.closeSlot = function(req, res, next) {
	var slotId = req.params.slotId;
	var bikeId = req.body.bikeId;

	console.log('Slot ' + slotId + ' closed with the bike ' + bikeId);
	var promise = slotService.get(slotId).then(function(slot) {
		return Promise.all([slotService.closeSlot(slot, bikeId), sessionService.updateSessionForClosedSlot(bikeId, slot)]);
	});
	
	handleResponse(promise, res, next);
};

exports.withdrawBike = function(req, res, next) {
	var slotId = req.params.slotId;

	var promise = slotService.get(slotId).then(function(slot) {
		console.log('The bike ' + slot.bikeId + ' has been withdrawn from slot ' + slot.id);

		return Promise.all([
			sessionService.activateSession(slot),
			slotService.withdrawBike(slot)
		]);
	});

	handleResponse(promise, res, next);
};

function handleResponse(promise, res, next) {
	promise.then(function() {
		res.ok();
	})
	.fail(function(err) {
		next(err);
	})
	.done();
};


