
var io, socket;
exports.init = function(app) {
	 io = socket.listen(app);

	 io.sockets.on('connection', function (s) {
	 	socket = s;
  //    socket.on('socketname', function);
  });
}

exports.notify = function(event, params) {

};