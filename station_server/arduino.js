
// al hacer close, leer el bikeid del sensor y enviar close al kiwiwebserver. esto puede ser tanto cuando la devolvés, como cuando pasan 20secs

var config     = require('./config.json'),
    serialport = require("serialport"),
    utils      = require('./utils'),
    SerialPort = serialport.SerialPort;

var serialPort = new SerialPort(config.serial.device, {
  baudrate: config.serial.baud_rate,
  parser: serialport.parsers.readline("\n")
});

serialPort.on('open', function() {
  serialPort.on('data', function(data) {

    var parsed = data.match(/([0-9]{3})([0-1]{1})/);

    arduino.on_status({
      slot_id: parsed[0],
      bike_status: parsed[1]
    });

  });
});

var arduino = {

  open_slot: function(slotId) {
    serialPort.write(parseInt(slotId) + "o\n");
  },

  close_slot: function(slotId) {
    serialPort.write(parseInt(slotId) + "c\n");
  },

  get_status: function() {
    serialPort.write("s\n");
  },

  on_status: function(data) {}

};

module.exports = arduino;


