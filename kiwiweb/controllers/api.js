var cons = require('../lib/cons');
var sessionService = require('../services/session');
var slotService = require('../services/slot');

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
	var userId = req.params.userId;
	var bikeId = req.body.bikeId;
	var slotFrom = req.body.slotFrom;

	handleResponse(sessionService.createSession(userId, bikeId, slotId), res, next);
};

exports.openSlot = function(req, res, next) {
	var slotId = req.params.slotId;
	
	handleResponse(slotService.openSlot(slotId), res, next);
};

exports.closeSlot = function(req, res, next) {
	var slotId = req.params.slotId;
	var bikeId = req.body.bikeId;

	promise = Promise.all([slotService.closeSlot(slotId, bikeId), sessionService.updateSessionForClosedSlot(bikeId, slotId)]);

	handleResponse(promise, res, next);
};

exports.withdrawBike = function(req, res, next) {
	var slotId = req.params.slotId;
	
	var promise = Promise.all([
		sessionService.activateSession(slotId),
		slotService.withdrawBike(slotId)
	]);

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


