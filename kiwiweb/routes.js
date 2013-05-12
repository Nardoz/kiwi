var autoloader = require('./lib/autoloader')

var controllers = autoloader.load(__dirname + '/controllers');

module.exports = function(app) {

    // Webapp
   
	app.get('/', controllers.main.index);

    app.get('/users', controllers.user.list);
    app.get('/users/active', controllers.user.getActiveSession);
    app.get('/users/:id', controllers.user.getById);

	app.get('/stations', controllers.station.list);
	app.get('/stations/:id', controllers.station.getById);

	//app.get('/sessions/:id', controllers.session.getById);

	// SMS
	app.post('/api/users/:userId/sessions', controllers.api.createSessionByUserId);
	app.post('/api/phones/:number/sessions', controllers.api.createSessionByPhonenumber);

	// Arduino
	app.put('/api/slots/:slotId/open', controllers.api.openSlot);
	app.put('/api/slots/:slotId/close', controllers.api.closeSlot);
	app.put('/api/slots/:slotId/withdraw', controllers.api.withdrawBike);



	/*
	app.get('/api/bikes', controllers.bike.list);
	app.get('/api/bikes/:id', controllers.bike.get);
	app.get('/api/bikes/:id/sessions', controllers.bike.get);
	app.get('/api/bikes/:id/sessions/active', controllers.bike.get);
*/


	/*app.get('/api/stations/:id/bikes', controllers.bike.findByStation);
	app.get('/api/stations/:id/slots', controllers.slot.findByStation);

	app.get('/api/slots', controllers.slot.list);
	app.get('/api/slots/:id', controllers.slot.get);
	*/

};