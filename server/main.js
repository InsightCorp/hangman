var path = require('path');
var browserify = require('browserify-middleware');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var singleRoomServer = require('./controllers/singleroomserver.js');

var game = require('./models/hangmangame.js');
var player = require('./models/player.js');

//var controller = require('./controllers/hangmancontroller.js');
var controller = require('./controllers/roomcontroller.js');
var room = controller.create(io);

app.use(express.static(path.join(__dirname, "../client/public")));

app.get('/bundle.js',
 browserify('./client/main.js', {
    transform: [ [ require('babelify'), { presets: ["es2015", "react"] } ] ]
  })
);

// Wire up SingleRoomServer
console.log('About to call singleroomserver');
io.on('connection', singleRoomServer(io));
console.log('After call to singleroomserver');

// If not in test environment start server
if (process.env.NODE_ENV !== 'test') {
  var port = process.env.PORT || 4000;
  //app.listen(port);
  server.listen(port);
  console.log("Listening on localhost:" + port);
}
// Export server for use in tests
module.exports = server;
