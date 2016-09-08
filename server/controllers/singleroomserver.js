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
  var complexWordGenerator = function(){
    return rcw.randomComplexWord();
  }
  var controller = [];
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

  return function onConnectionHandler (socket) {
  var cookieRoomId = socket.handshake.headers.cookie.substr(socket.handshake.headers.cookie.indexOf("roomId")+7);
  var savedIndex = -1;
  for(var index=0; index<controller.length; index++){
    console.log(controller[index].getRoom().getId(), "and ", cookieRoomId)
    if(controller[index].getRoom().getId() === cookieRoomId) {
      console.log("found room!", index)
      savedIndex = index;
    } 
  }
  // Treat each new connection as a new Player
  if(savedIndex == -1){
  controller.push(RoomController.create(io));
  controller[controller.length-1].setWordGenerator(complexWordGenerator);
  controller[controller.length-1].setRestartDelay(restartDelay);
  controller[controller.length-1].newGame();
  savedIndex = controller.length-1;
  console.log("new room!");
  // Return our connection handler
  }
  var player = Player.create(socket);
  console.log("index before controller,", savedIndex)
  // Server has only one room so add all Players
  controller[savedIndex].join(player);
  };

}
