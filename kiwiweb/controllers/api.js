var cons = require('../lib/cons');
var request = require('../lib/request');
var sessionService = require('../services/session');
var slotService = require('../services/slot');
var userService = require('../services/user');
var stationService = require('../services/station');

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
	var userId = parseInt(req.params.userId);
	var slotId = parseInt(req.body.slotId);

	//if(!userId || !slotId) next(Error('Invalid parameters')); return;

	console.log('Creating session for user ' + userId + ' and slot ' + slotId);

	var promise = userService.get(userId).then(function(user) {
		return createSession(user, slotId);
	});

	handleResponse(promise, res, next);
};

exports.createSessionByPhonenumber = function(req, res, next) {
	var phoneNumber = req.params.number;
	var slotId = parseInt(req.body.slotId,10);

	//if(!phoneNumber || !slotId) next(Error('Invalid parameters')); return;

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
			return sessionService.createSession(user, slot)
			.then(function() {
				console.log('Slot ' + slot.id + ' belongs to station "' + slot.station.name + '"');
				console.log('Notifying station "' + slot.station.name + '" (IP:' + slot.station.ip + ')');
				return true;//request.get("http://" + slot.station.ip + "/slots/" + slot.id + "/open");
			});
		});
		
}


exports.updateStationIP = function(req, res, next) {
	var stationId = parseInt(req.params.stationId);
	var ip = req.body.ip;

	//if(!stationId || !ip) next(Error('Invalid parameters')); return; 

	handleResponse(stationService.updateIP(stationId, ip) , res, next);
}

exports.openSlot = function(req, res, next) {
	var slotId = parseInt(req.params.slotId);

	//if(!slotId) next(Error('Invalid parameters')); return;

	console.log('Slot ' + slotId + ' open');

	var promise = slotService.get(slotId).then(function(slot) {
		console.log(slot);
		return slotService.openSlot(slot);
	});
	
	handleResponse(promise, res, next);
};

exports.closeSlot = function(req, res, next) {
	var slotId = parseInt(req.params.slotId);
	var bikeId = parseInt(req.body.bikeId);

	//if(!slotId || !bikeId) next(Error('Invalid parameters')); return;

	console.log('Slot ' + slotId + ' closed with the bike ' + bikeId);
	var promise = slotService.get(slotId).then(function(slot) {
		return Promise.all([slotService.closeSlot(slot, bikeId), sessionService.updateSessionForClosedSlot(bikeId, slot)]);
	});
	
	handleResponse(promise, res, next);
};

exports.withdrawBike = function(req, res, next) {
	var slotId = parseInt(req.params.slotId);

	//if(!slotId) next(Error('Invalid parameters')); return;

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
		res.json({});
	})
	.fail(function(err) {
		next(err);
	})
	.done();
};


