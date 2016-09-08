//  _______________________________________
// / I am a simple server with support for \
// \ only one room!                        /
//  ---------------------------------------
//        \   ^__^
//         \  (oo)\_______
//            (__)\       )\/\
//                ||----w |
//                ||     ||
var Player = require('../models/player.js');
var RoomController = require('./roomcontroller.js');
var randomWords = require('random-words');
var rcw = require('../models/randomComplexWords.js');
// Simple server for socket.io on 'connection' events
// Server will:
// 1.) Create a new RoomController
// 2.) Create a new Room and a new Game through RoomController
// 3.) Return a new Handler for incoming socket connections

// Returned Handler will:
// 1.) Create a new Player for each incoming connection
// 2.) Add Player to Room

// To Use:
// Invoke exported function with server's socket io
// this will create a new handler that can be used in io.on('connection')
module.exports = function (io, wordGenerator, restartDelay) {
  // Create RoomController to manage Room and Game
  var complexWordGenerator = function(){
    return rcw.randomComplexWord();
  }
  var controller = RoomController.create(io);
  if (wordGenerator === undefined) {
  // Configure RoomController to use a random word for each new Game
    wordGenerator = function () {
      return randomWords(1)[0];
    };
  }
  if (restartDelay === undefined) {
  // Initialize RoomController to restart games after a 30 second delay
    restartDelay = 2000;
  }
  // Configure controller with above options
  controller.setWordGenerator(complexWordGenerator);
  controller.setRestartDelay(restartDelay);
  controller.newGame();
  // Return our connection handler
  var controller = [];

  return function onConnectionHandler (socket) {
    // Treat each new connection as a new Player
    controller.push(RoomController.create(io));
    if (wordGenerator === undefined) {
    // Configure RoomController to use a random word for each new Game
      wordGenerator = function () {
        return randomWords(1)[0];
      };
    }
    if (restartDelay === undefined) {
    // Initialize RoomController to restart games after a 30 second delay
      restartDelay = 2000;
    }
    // Configure controller with above options
    controller[controller.length-1].setWordGenerator(wordGenerator);
    controller[controller.length-1].setRestartDelay(restartDelay);
    controller[controller.length-1].newGame();
  // Return our connection handler
  console.log("controller array length", controller.length)
    var player = Player.create(socket);
    // Server has only one room so add all Players
    controller[controller.length-1].join(player);
  };
}
