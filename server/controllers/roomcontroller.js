// Automatically join the room on connection
var Room = require('../models/room.js');

var RoomController = {};

RoomController.create = function (io) {
  var room = Room.create();
  console.log("roomid", room.getId());
  var restartDelay = 30000;

  // wordGenerator is used to create new Games, should be set in setWordGenerator
  var wordGenerator = function () {
    return '';
  };

  // Setup Controller's Public API
  var controller = {
    newGame: function (solution) {
      room.newGame( solution !== undefined ? solution : wordGenerator() );
    },
    setWordGenerator: function (fn) {
      wordGenerator = fn;
    },
    setRestartDelay: function (delay) {
      restartDelay = delay;
    },
    getRoom: function () {
      return room;
    },
    join: function (player) {
      room.join(player);
      var socket = player.getSocket();
      socket.join(room.getId());
      // Configure Events
      socket.on('disconnect', function () {
          // Leave our Room model
          room.leave(socket.id);
          // Broadcast a playerLeaveRoom event to other sockets
          io.in(room.getId()).emit('playerLeaveRoom', { playerId: player.getId() });
      });

      socket.on('guessLetter', function (data) {
        room.guessLetter(player, data.letter);
      });

      // Send initial Events
      socket.emit('enterRoom', {
        playerId: player.getId(),
        gameState: room.getGame().getState(),
        players: room.getPlayers().map(function (player) {
          return player.getId();
        })
      });

      socket.broadcast.to(room.getId())
        .emit('playerEnterRoom', { playerId: player.getId() });

    }
  }

  // Configure Room Events
  room.onCorrectGuess(function (player, letter, cooldown) {
    io.in(room.getId()).emit('correctGuess', {
      playerId: player.getId(),
      coolDown: cooldown,
      gameState: room.getGame().getState(),
    });
  });

  room.onIncorrectGuess(function (player, letter, cooldown) {
    io.in(room.getId()).emit('incorrectGuess', {
      playerId: player.getId(),
      coolDown: cooldown,
      gameState: room.getGame().getState(),
    });
  });

  var startGameAfterRestartDelay = function () {
    setTimeout(function () {
      controller.newGame();
      io.emit('startGame', {
        gameState: room.getGame().getState(),
      });
    }, restartDelay);
  }

  room.onWin(function (player) {
    io.in(room.getId()).emit('win', {
      playerId: player.getId(),
      gameState: room.getGame().getState(),
      timeUntilNextGame: restartDelay + Date.now()
    });
    startGameAfterRestartDelay();
  });

  room.onLose(function (player) {
    io.in(room.getId()).emit('loss', {
      playerId: player.getId(),
      gameState: room.getGame().getState(),
      timeUntilNextGame: restartDelay + Date.now()
    });
    startGameAfterRestartDelay();
  })

  return controller;
}

module.exports = RoomController;
