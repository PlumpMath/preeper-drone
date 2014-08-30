var WebSocketServer = require('ws').Server;
var express = require('express');
var arDrone = require('ar-drone');
var client = arDrone.createClient();

var app = express();
app.use(express.static(__dirname + '/public'));

var server = app.listen(5000, function(req, res) {
  console.log('Express listening on port', server.address().port);
});

var wss = new WebSocketServer({ server: server });

wss.on('connection', function(ws) {
  // get drone data
  client.on('navdata', function(data) {
    ws.send(JSON.stringify(data));
  });

  // listen for commands
  ws.on('message', function(msg) {
    if (msg.match(/command/)) {
      sendPreepCommand(msg.substring(8));
    }
  });
});

function sendPreepCommand(cmd) {
  switch (cmd) {
    case 'takeoff':
      client.takeoff();
      break;

    case 'land':
      client.land();
      break;
  }
}
