var HangmanGame = {};

HangmanGame.create = function( solution ) {
  solution = solution.split('');
  var word = Array(solution.length).fill(null);
  var guessLetters = [];
  var remainingGuesses = 6;

  var game = {
    getWord: function() {
      return solution.map(function(letter) {
        return guessLetters.indexOf(letter) === -1 ? null : letter;
       });
    },
    // guessLetter returns true if letter is a correct guess, false otherwise
    guessLetter: function(letter) {
      // If letter has not been guessed before then add it to guessedLetters
      if (guessLetters.indexOf(letter) === -1) {
        guessLetters.push(letter);
      }
      // If letter is not in solution then reduce remaining guesses by one
      if (solution.indexOf(letter) === -1) {
        remainingGuesses--;
        return false;
      }
      return true;
    },
    getGuessedLetters: function() {
      return guessLetters.slice();
    },
    isWon: function() {
      return game.getWord().indexOf(null) === -1;
    },
    isLoss: function() {
      return remainingGuesses <= 0;
    }
  }

  return game;
};





module.exports = HangmanGame;
