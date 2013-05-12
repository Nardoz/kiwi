
var app     = require('express')(),
    server  = require('http').createServer(app),
    actions = require('./actions');

app.get('/open_slot', actions.open_slot);
app.get('/set_bike', actions.set_bike);
app.get('/get_bike', actions.get_bike);

server.listen(8080);




