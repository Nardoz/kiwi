
var utils      = require('./utils'),
    config     = require('./config.json')
    serialport = require("serialport"),
    SerialPort = serialport.SerialPort;


var serialPort = new SerialPort(config.serial.device, {
  baudrate: config.serial.baud_rate,
  parser: serialport.parsers.readline("\n")
});


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
