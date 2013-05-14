
var app     = require('express')(),
    server  = require('http').createServer(app),
    config  = require('./config.json'),
    utils   = require('./utils'),
    arduino = require('./arduino');

var current_bikeid = '1';


require('dns').lookup(require('os').hostname(), function(err, address, fam) {
  utils.sendRequest('/stations/' + config.station_id, { ip: address + ':' + config.port });
});

arduino.on_status = function(s) {

  status = s;

  if(status.bike_status === 0) {
    utils.sendRequest('/slots/' + status.slot_id + '/withdraw');
  }

  else if(status.bike_status === 0) {
    arduino.close_slot(slot);
    utils.sendRequest('/slots/' + status.slot_id + '/close', { bikeId: current_bikeid });
  }

};

app.get('/slots/:id/open', function(req, res) {

  var slotId = '0' + req.params.id;


  if(slotId !== undefined && utils.slotIsValid(config.station_id, slotId)) {
console.log(slotId)
    var parsed = utils.parseSlot(slotId);
    var slot = parsed[2];

    arduino.open_slot(slot);

    utils.sendRequest('/slots/' + req.params.id + '/open');

    var status = {
      slot_id: req.params.id,
      bike_status: 1,
      lock_status: 1
    };

    setTimeout(function() {

      if(status.bike_status === 1) {
        arduino.close_slot(slot);
        utils.sendRequest('/slots/' + status.slot_id + '/close', { bikeId: current_bikeid });
      }

    }, config.timeout * 1000);

    res.end('ok');

  } else {
    res.end('invalid_slotid');
  }

});

app.get('/bike', function(req, res) {
  res.write(current_bikeid);
  res.end();
});

app.put('/bike', function(req, res) {

  var bikeId = req.body.bikeId;

  if(bikeId !== undefined && bikeId > 0) {
    current_bikeid = bikeId;
    res.write(bikeId);
    res.end();
  } else {
    res.end('invalid_bikeid');
  }

});

server.listen(config.port);

