import io from 'socket.io-client';

export default class ServerAPI {

  // creates a socket.io-client connection
  constructor(port) {
    this.port = port;
    this.client = 
    {handshake :
      {headers: 
        {cookie :document.cookie}
      }
    }
  }

  disconnect() {
    this.client.disconnect();

  }

  connect() {
    console.log('I am connecting now to io')
    this.client = io.connect('http://localhost:' + this.port);
  }

  // Registers a callback to be invoked when game begins
  // callback will receive object { word: [ ..array of nulls or strings ] }
  onStartGame(callback) {
    this.client.on('startGame', callback);
  }

  // Sends a letter to the server that represents a guess
  makeGuess(letter) {
    // console.log("client make guess", letter)
    this.client.emit('guessLetter', { letter: letter })
  }

  // Sends a letter to the server that represents a guess
  playAgain() {
    console.log("client play again")
    this.client.emit('playAgain')
  }

  // Registers a callback to be invoked on an incorrect guess
  // callback will receive object { guessedLetters: [..strings], remainingGuesses: number }
  onIncorrectGuess(callback) {
    this.client.on('incorrectGuess', callback);
  }

  // Registers a callback to be invoked on a correct guess
  // callback will receive object { guessedLetters: [..strings], remainingGuesses: number }
  onCorrectGuess(callback) {
    this.client.on('correctGuess', callback);
  }

  // Registers a callback to be invoked when a game is won
  onWin(callback) {
    this.client.on('win', callback);
  }

  // Registers a callback to be invoked when a game is lost
  onLose(callback) {
    this.client.on('loss', callback);
  }

  onPlayerLeaveRoom (callback) {
    this.client.on('playerLeaveRoom', callback);
  }

  onPlayerEnterRoom (callback) {
    this.client.on('playerEnterRoom', callback);
  }

  onEnterRoom (callback) {
    this.client.on('enterRoom', callback);
  }

  getImageUrl (callback) {
    this.client.on('getImageUrl', callback);
  }

}
