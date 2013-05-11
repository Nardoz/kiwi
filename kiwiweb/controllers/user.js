var db = require('../lib/db');

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

exports.list = function(req, res, next) {
	handle(db.find('users'), res, next);
};

exports.getById = function(req, res, next) {
	handle(db.findOne('users', {id: parseInt(req.params.id, 10)}), res, next);
};

exports.getSessions = function(req, res, next) {
	res.render('index', { title: 'Expreso' });
};

exports.getActiveSession = function(req, res, next) {
	res.render('index', { title: 'Expreso' });
};

exports.closeSession = function(req, res, next) {
	res.render('index', { title: 'Expreso' });
};


