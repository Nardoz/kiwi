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
	var slotId = req.body.slotFrom;

	var promise = userService.get(userId).then(function(user) {
		return createSession(user, slotId);
	});

	handleResponse(promise, res, next);
};

exports.createSessionByPhonenumber = function(req, res, next) {
	var phoneNumber = req.params.number;
	var slotId = req.body.slotFrom;

	var promise = userService.getByPhonenumber(phoneNumber).then(function(user) {
		return createSession(user, slotId);
	});

	handleResponse(promise, res, next);
};

function createSession(user, slotId) {
	return slotService.get(slotId)
		.then(function(slot) {
			return sessionService.createSession(user, slot);	
		});
}

exports.openSlot = function(req, res, next) {
	var slotId = req.params.slotId;

	var promise = slotService.get(slotId).then(function(slot) {
		return slotService.openSlot(slot);
	});
	
	handleResponse(promise, res, next);
};

exports.closeSlot = function(req, res, next) {
	var slotId = req.params.slotId;
	var bikeId = req.body.bikeId;

	var promise = slotService.get(slotId).then(function(slot) {
		return Promise.all([slotService.closeSlot(slot, bikeId), sessionService.updateSessionForClosedSlot(bikeId, slot)]);
	});
	
	handleResponse(promise, res, next);
};

exports.withdrawBike = function(req, res, next) {
	var slotId = req.params.slotId;
	
	var promise = slotService.get(slotId).then(function(slot) {
		return Promise.all([
			sessionService.activateSession(slot),
			slotService.withdrawBike(slot)
		]);
	});

	handleResponse(promise, res, next);
};

function handleResponse(promise, res, next) {
	promise.then(function() {
		console.log('slot ' + slotId + ' updated');
		res.ok();
	})
	.fail(function(err) {
		next(err)
	})
	.done();
};


