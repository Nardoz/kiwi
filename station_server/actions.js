
var utils      = require('./utils'),
    config     = require('./config.json')
    serialport = require("serialport"),
    SerialPort = serialport.SerialPort;


var serialPort = new SerialPort(config.serial.device, {
  baudrate: config.serial.baud_rate,
  parser: serialport.parsers.readline("\n")
});

exports.current_bikeid = '1';

exports.open_slot = function(req, res) {

  var slotId = req.query.slot_id;

  if(slotId !== undefined && utils.slotIsValid(config.station_id, slotId)) {

    var parsed = utils.parseSlot(slotId);
    serialPort.write('open ' + parseInt(parsed[2]) + "\n");

    res.end('ok');

  } else {
    res.end('invalid_slotid');
  }

};

exports.set_bike = function(req, res) {

  var bikeId = req.query.bike_id;

  if(bikeId !== undefined && bikeId > 0) {
    exports.current_bikeid = bikeId;
    res.end(bikeId);
  } else {
    res.end('invalid_bikeid');
  }

};


exports.get_bike = function(req, res) {
  res.end(exports.current_bikeid);
};



// al hacer close, leer el bikeid del sensor y enviar close al kiwiwebserver. esto puede ser tanto cuando la devolvés, como cuando pasan 20secs
