
var request = require('request'),
    config  = require('./config.json');

module.exports = {

  slotIsValid: function(station, slot) {
    var parsed = this.parseSlot(slot);
    return parsed !== null && parsed.length === 3 && parsed[1] === station;
  },

  parseSlot: function(slotId) {
    return slotId.match(/([0-9]{2})([0-9]{2})/);
  },

  sendRequest: function(action, data) {

    if(data === undefined) {
      data = {};
    }

    request.put(config.kiwi.hostname + ':' + config.kiwi.port + '/api' + action, { json: data });
  }

};
