var socketIO = require('socket.io');
var socket;

exports.init = function(app) {
	var io = socketIO.listen(app);

	io.sockets.on('connection', function (s) {
 		socket = s;
	});
};

exports.notify = function(eventName, params) {
	if(!socket) throw Error('Socket.IO was not initialized');
	socket.emit(eventName, params);
};