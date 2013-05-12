
module.exports = {
  slotIsValid: function(station, slot) {
    var parsed = this.parseSlot(slot);
    return parsed !== null && parsed.length === 3 && parsed[1] === station;
  },
  parseSlot: function(slotId) {
    return slotId.match(/([0-9]{2})([0-9]{2})/);
  }
};
