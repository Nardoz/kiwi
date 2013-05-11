var autoloader = require('./lib/autoloader')

var controllers = autoloader.load(__dirname + '/controllers');

module.exports = function(app) {
    // Webapp API
   
	app.get('/', controllers.main.index);

    app.get('/users', controllers.user.list);
    app.get('/users/:id', controllers.user.getById);
	//app.get('/users/active', controllers.user.getActiveSession);


	/*
	app.get('/api/bikes', controllers.bike.list);
	app.get('/api/bikes/:id', controllers.bike.get);
	app.get('/api/bikes/:id/sessions', controllers.bike.get);
	app.get('/api/bikes/:id/sessions/active', controllers.bike.get);
*/

	app.get('/stations', controllers.station.list);
	app.get('/stations/:id', controllers.station.getById);

	/*app.get('/api/stations/:id/bikes', controllers.bike.findByStation);
	app.get('/api/stations/:id/slots', controllers.slot.findByStation);

	app.get('/api/slots', controllers.slot.list);
	app.get('/api/slots/:id', controllers.slot.get);
	*/

	// SMS
	app.post('/api/user/:id/sessions', controllers.user.closeSession)

	// Arduino
	//app.put('/api/slots/:id')
};