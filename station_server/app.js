
var app        = require('express')(),
    server     = require('http').createServer(app),
    serialport = require("serialport"),
    SerialPort = serialport.SerialPort;

var serialPort = new SerialPort('/dev/tty.usbmodemfa131', {
  baudrate: 57600,
  parser: serialport.parsers.readline("\n")
});

var stationId = '001';

function slotIsValid(station, slot) {
  var parsed = parseSlot(slot);
  return parsed !== null && parsed.length === 3 && parsed[1] === station;
}

function parseSlot(slotId) {
  return slotId.match(/([0-9]{3})([0-9]{3})/);
}

app.get('/open_slot', function(req, res) {

  var slotId = req.query.slot_id;

  if(slotId !== undefined && slotIsValid(stationId, slotId)) {

    var parsed = parseSlot(slotId);
    serialPort.write('open ' + parseInt(parsed[2]) + "\n");

    res.end('ok');
    return;
  }

  res.end('invalid_slotid');

});

server.listen(8080);
