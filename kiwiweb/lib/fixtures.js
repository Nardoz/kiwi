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
		ip:'100.100.100.100',
		name: 'Retiro'
	},
	{
		id: 2,
		coords: {
			lat: -34.6063,
			long: -58.3811
		},
		ip:'102.102.102.102',
		name: 'Obelisco'
	}
];

var slots = [
	{
		id: 1001,
		bikeId: 1,
		open: false,
		stationId: 1
	},
	{
		id: 1002,
		bikeId: null,
		open: false,
		stationId: 1
	},
	{
		id: 2001,
		bikeId: 2,
		open: false,
		stationId: 2
	},
	{
		id: 2002,
		bikeId: 4,
		open: false,
		stationId: 2
	},
];

var now = new Date();
var sessions = [
	{
		id: 1,
		userId: 1001,
		bikeId: 3,
		slotFrom: 2002,
		dateFrom: new Date(now.getTime()-4*60*60*1000), //3 hours before now 
		slotTo: null,
		dateTo: null,
		status: CONS.SESSION.STATUS.ACTIVE
	},
	{
		id: 2,
		userId: 1,
		bikeId: 3,
		slotFrom: 1002,
		dateFrom: new Date(now.getTime()-10*60*60*1000), //3 hours before now 
		slotTo: 2001,
		dateTo: new Date(now.getTime()-8*60*60*1000),
		status: CONS.SESSION.STATUS.FINISHED
	},
	{
		id: 3,
		userId: 1,
		bikeId: 4,
		slotFrom: 2001,
		dateFrom: new Date(now.getTime()-6*60*60*1000), //3 hours before now 
		slotTo: 1001,
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