var db = require('./db');
var Promise = require('./promise');
var CONS = require('./cons');

var users = [
				{
					id: 1,
					cel: "115551234",
					name: "Juan",
					apellido: "Perez",
					dni: "34123543"
				},
				{
					id: 2,
					cel: "115357654",
					name: "Pablo",
					apellido: "Paladino",
					dni: "30212123"
				},
				{
					id: 3,
					cel: "114551234",
					name: "Nicolas",
					apellido: "Melendez",
					dni: "32123123"
				},
				{
					id: 4,
					cel: "113521234",
					name: "Martin",
					apellido: "Moscovich",
					dni: "30345785"
				},
				{
					id: 5,
					cel: "113521234",
					name: "Alan",
					apellido: "Reid",
					dni: "34345235"
				}
];

var bikes = [
	{id: 1},
	{id: 2},
	{id: 3},
	{id: 4}
];

var stations = [
	{
		id: 1,
		coords: {
			lat: -34.5923,
			long: -58.375
		},
		ip:'fake',
		name: 'Retiro'
	},
	{
		id: 2,
		coords: {
			lat: -34.6063,
			long: -58.3811
		},
		ip:'fake',
		name: 'Obelisco'
	}
];

var slots = [
	{
		id: 101,
		bikeId: 1,
		open: false,
		stationId: 1
	},
	{
		id: 102,
		bikeId: null,
		open: true,
		stationId: 1
	},
	{
		id: 201,
		bikeId: 2,
		open: false,
		stationId: 2
	},
	{
		id: 202,
		bikeId: null,
		open: true,
		stationId: 2
	},
];

var now = new Date();
var sessions = [
	{
		id: 1,
		userId: 3,
		bikeId: 3,
		slotFrom: 102,
		dateFrom: new Date(now.getTime()-4*60*60*1000), //3 hours before now 
		slotTo: null,
		dateTo: null,
		status: CONS.SESSION.STATUS.ACTIVE
	},
	{
		id: 1,
		userId: 1,
		bikeId: 4,
		slotFrom: 202,
		dateFrom: new Date(now.getTime()-10*60*60*1000), //3 hours before now 
		slotTo: null,
		dateTo: null,
		status: CONS.SESSION.STATUS.ACTIVE
	},
	{
		id: 2,
		userId: 1,
		bikeId: 3,
		slotFrom: 102,
		dateFrom: new Date(now.getTime()-10*60*60*1000), //3 hours before now 
		slotTo: 201,
		dateTo: new Date(now.getTime()-8*60*60*1000),
		status: CONS.SESSION.STATUS.FINISHED
	},
	{
		id: 3,
		userId: 1,
		bikeId: 4,
		slotFrom: 201,
		dateFrom: new Date(now.getTime()-6*60*60*1000), //3 hours before now 
		slotTo: 101,
		dateTo: new Date(now.getTime()-5*60*60*1000),
		status: CONS.SESSION.STATUS.FINISHED
	}
];

var collections = {
	'users': users,
	'bikes': bikes,
	'stations': stations,
	'slots': slots,
	'sessions': sessions
};

exports.init = function() {
	console.log('Loading fixtures');
	var promises = db.collections.map(function(collection) {
		//console.log('Initializing collection ' + collection);
		if(!collections[collection]) Promise.resolve(true);

		return db.remove(collection)
		.then(function(){

			var p = collections[collection].map(function(model) {
				var col = collection;
				return db.insert(col, model);
			});
		});

		return Promise.all(p);
	});

	return Promise.all(promises)
		.then(function() {
			console.log('FINISHED loading fixtures');
		});
};