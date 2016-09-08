var Bing = require('./bingAPI.js');

var HangmanGame = {};

HangmanGame.create = function( solution) {
  var splitSolution = solution.toLowerCase().split('');
  var word = Array(solution.length).fill(null);
  var guessedLetters = [];
  var remainingGuesses = 6;

  var game = {
    getWord: function() {
      return splitSolution.map(function(letter) {
        return guessedLetters.indexOf(letter) === -1 ? null : letter;
       });
    },
    // guessLetter returns true if letter is a correct guess, false otherwise
    guessLetter: function(letter) {
      letter = letter.toLowerCase();
      // If letter has not been guessed before then add it to guessedLetters
      if (!game.hasBeenGuessed(letter)) {
        guessedLetters.push(letter);
      }
      // If letter is not in solution then reduce remaining guesses by one
      if (solution.indexOf(letter) === -1) {
        remainingGuesses--;
        return false;
      }
      return true;
    },
    getGuessedLetters: function() {
      return guessedLetters.slice();
    },
    hasBeenGuessed: function (letter) {
      return (guessedLetters.indexOf(letter) !== -1);
    },
    isWon: function() {
      return game.getWord().indexOf(null) === -1;
    },
    isLoss: function() {
      return remainingGuesses <= 0;
    },
    getSolution: function () {
      return solution;
    },
    getRemainingGuesses: function () {
        return remainingGuesses;
    },
    getState: function () {
      return {
        word: game.getWord(), // keep state immutable
        guessedLetters: game.getGuessedLetters(),
        remainingGuesses: game.getRemainingGuesses(),
        isDone: game.isLoss() || game.isWon()
      }
    }
  }

  return game;
};

module.exports = HangmanGame;
