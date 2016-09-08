import React from 'react';
import ServerAPI from '../models/ServerAPI'
import Alphabets from './Alphabets.js';
import Gallows from './Gallows.js';
import GuessedLetters from './GuessedLetters.js';
import RemainingGuess from './RemainingGuess.js';
import Word from './Word.js';
import Hint from './Hint.js';

export default class GameBoard extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var guessedLettersUpper = this.props.guessedLetters.map((letter)=>{return letter.toUpperCase()});
		return(
		// 	<div className ='gameBoard'>	
		// 		<Gallows remainingGuesses={this.props.remainingGuesses} />
		// 		<RemainingGuess remainingGuesses={this.props.remainingGuesses} />
		// 		<Word word={this.props.word} />
		// 		<GuessedLetters guessedLetters={guessedLettersUpper} />
		// 		<Alphabets guessedLetters={guessedLettersUpper} models = {this.props.models}/>	
		// 	</div>
		// )
		// var guessedLettersUpper = this.props.guessedLetters.map((letter)=>{return letter.toUpperCase()});
					<div>
						<div id="guessed-row">
							<GuessedLetters guessedLetters={guessedLettersUpper} />
							<RemainingGuess remainingGuesses={this.props.remainingGuesses} />
						</div>
						<div id="theword-row">
							<Word word={this.props.word} />
						</div>
						<div id="alphabet-row">
							<Alphabets 
								guessedLetters={guessedLettersUpper} 
								coolDown = {this.props.coolDown}
								serverAPI={this.props.serverAPI} />
						</div>
						<Hint hintPicUrl={this.props.hintPicUrl}/>
					</div>
		)
	}

}
