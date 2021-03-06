var db = require('../lib/db');
var Promise = require('../lib/promise');
var CONS = require('../lib/cons');
var _ = require('underscore');

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
	db.find('users')
	.then(function(users){
		res.render('usuarios', { title: 'Usuarios', users: users});
	}).done();
};

exports.getById = function(req, res, next) {
	Promise.all([
		db.findOne('users', {id: parseInt(req.params.id, 10)}),
		db.find('sessions', {userId: parseInt(req.params.id, 10)})
	])
	.spread(function(user,sessions){
		res.render('usuario', { title: 'Usuario: ' + user.name, user: user, sessions: sessions });
	})
	.done();
};

exports.getSessions = function(req, res, next) {
	res.render('index', { title: 'Expreso' });
};

exports.getActiveSession = function(req, res, next) {

	db.find('sessions', {status : CONS.SESSION.STATUS.ACTIVE})
	.then(function(sessions) {
		var usersArray = _.map(sessions, function (s) { return s.userId })
		console.log('users array', usersArray);
		db.find('users', { id : { $in : usersArray}})
		.then(function (users) {

			_.each(users, function (u) {
				u.session = _.find(sessions, function (s) { return u.id == s.userId} );
			});

			res.render('activeSession', {
			 title: 'Usuarios Activos: ' + sessions.length,
			 sessions : sessions, 
			 users : users});
		})
		.done();
	})
	.done();

};

exports.closeSession = function(req, res, next) {
	res.render('index', { title: 'Expreso' });
};


