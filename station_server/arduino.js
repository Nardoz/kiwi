
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

    var parsed = data.match(/([0-9]{2})([0-1]{1})/);

    if(parsed !== null) {

      arduino.on_status({
        slot_id: parsed[0],
        bike_status: parsed[2]
      });

    } else {
      console.log('Error reading incoming data: ' + data);
    }

  });
});

var arduino = {

  open_slot: function(slotId) {
    console.log(slotId + "o\n")
    serialPort.write(slotId + "o\n");
  },

  close_slot: function(slotId) {
    console.log(slotId + "c\n")
    serialPort.write(slotId + "c\n");
  },

  get_status: function() {
    serialPort.write("s\n");
  },

  on_status: function(data) {}

};

module.exports = arduino;


