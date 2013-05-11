var db = require('../lib/db');
var Promise = require('../lib/promise');

function handle(promise, res, next) {
	promise
	.then(function(result) {

		res.render
	})
	.fail(function(err) {
		 return next(err);
	})
	.done();
}

exports.list = function(req, res, next) {
	db.find('stations')
	.then(function(stations){
		res.render('estaciones', { title: 'Usuarios', stations: stations });
	}).done();
};

exports.getById = function(req, res, next) {
	Promise.all([
		db.findOne('stations', {id: parseInt(req.params.id, 10)}),
		db.find('slots', {stationId: parseInt(req.params.id, 10)})
	])
	.spread(function(station,slots){
		res.render('estacion', { title: 'Estación: ' + station.name, station: station, slots: slots });
	})
	.done();
};
