
var app        = require('express')(),
    server     = require('http').createServer(app),
    actions    = require('./actions');

app.get('/open_slot', actions.open_slot);

server.listen(8080);




