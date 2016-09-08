import React from 'react';
import ServerAPI from '../models/ServerAPI';
import GameBoard from './GameBoard';
import Gallows from './Gallows.js';
import Outcome from './Outcome.js';
import Players from './Players';
import Dropdown from 'react-simple-dropdown';
import Themes from "./Themes.js"

export default class Room extends React.Component {
	

	constructor(props) {
		super(props);
		this.state = {	
	        word: [], // keep state immutable
    		guessedLetters: [],
    		remainingGuesses: 6,
    		isDone: false,
			players:[],
			coolDown:0,
			timeUntilNextGame: 0,
			background: "snowy",
			coolDown:0,
			myRoom: "",
			hintPic:''
		};
		
		this.playerId = ""
		this.outcome = {
			win: true,
			player: "",
		}

		// setup socket & initialize
		this.serverAPI = new ServerAPI(4000);
		this.serverAPI.connect();	
		this.serverAPI.onEnterRoom((res)=>{
			console.log("Enter Room", res);
			this.playerId = res.playerId;
			var playerList = res.players.slice();
			//playerList.push(res.playerId);
			console.log(document.cookie, "cookie!!");
			document.cookie = "roomId=" + res.roomId; 
			this.setState({
				'players' : playerList,
		        'word':  res.gameState.word,
	    		'guessedLetters': res.gameState.guessedLetters,
	    		'remainingGuesses': res.gameState.remainingGuesses,
	    		'isDone': res.gameState.isDone,
	    		'roomId' : res.roomId
			});
		})


		this.serverAPI.getImageUrl((hintPic)=>{
			console.log("hintPic url", hintPic.url);
			this.setState({
				hintPic: hintPic.url
			})
		})

		// Update players
		this.serverAPI.onPlayerEnterRoom((res)=>{
			console.log("Player enter room", res, this.state);
			var playerList = this.state.players;
			console.log("playerlist: ", playerList)
			playerList.push(res.playerId);
			this.setState({
				players: playerList,
				myRoom: res.roomId
			})
		});

		this.serverAPI.onPlayerLeaveRoom((res)=>{
			console.log("Player Leave room", res);
			var playerList = this.state.players;
			if(playerList.indexOf(res.playerId)>0){
				playerList.splice(playerList.indexOf(res.playerId), 1);
			}
			this.setState({
				players: playerList
			})
		});

		// Game related events
		this.serverAPI.onStartGame( (res) => {
			console.log("Start game", res.gameState);
			this.setGameState(res.gameState);
		});

		this.serverAPI.onIncorrectGuess((res)=>{
			console.log("Incorrect Guess", res);
			if(res.playerId === this.playerId){
				this.setGameState(res.gameState);
			} else{
				this.setGameState(res.gameState);
			}
		})

		this.serverAPI.onCorrectGuess((res)=>{
			console.log("Correct Guess", res, res.playerId, this.playerId);
			if(res.playerId === this.playerId){
				this.setGameState(res.gameState, res.coolDown);
			} else{
				this.setGameState(res.gameState );
			}
		})

		this.serverAPI.onWin((res)=>{
			console.log("win!", res)
			this.outcome.win = true;
			this.outcome.player = res.playerId;
			this.runAnimation("win");
			this.setEndGameState(res.gameState, res.timeUntilNextGame)
		})

		this.serverAPI.onLose((res)=>{
			console.log("lose!", res)
			this.outcome.win = false;
			this.outcome.player = res.playerId;
			this.runAnimation("head");
			this.setEndGameState(res.gameState, res.timeUntilNextGame)

		})
	}

	setGameState(gameState, coolDown){
		// console.log("setting game state: ", gameState, coolDown)
		if(coolDown > 0){
			console.log("updating with coolDown", gameState)
			this.setState({
		        'word':  gameState.word, // keep state immutable
	    		'guessedLetters': gameState.guessedLetters,
	    		'remainingGuesses': gameState.remainingGuesses,
	    		'isDone': gameState.isDone,
	    		'coolDown': coolDown
			})
		} else {
			console.log("updating without coolDown", gameState)
			this.setState({
		        'word':  gameState.word, // keep state immutable
	    		'guessedLetters': gameState.guessedLetters,
	    		'remainingGuesses': gameState.remainingGuesses,
	    		'isDone': gameState.isDone
			})		
		}
	}

	runAnimation(choice){
		if(choice !== "win"){
			var choice = Math.ceil((Math.random() * 2))
		}
		if(choice === 1){
			setTimeout(function(){
				document.getElementById("train").style.display = "none";
				document.getElementById("gallowMan").style.display = "block";
			},2000)
			document.getElementById("outcome").style.display = "block";
			document.getElementById("train").style.display = "block";
			setTimeout(function () {
				document.getElementById("gallowMan").style.display = "none";	
				document.getElementById("rope").style.display = "none";
				document.getElementById("nuse").style.display = "none";
				document.getElementById("rope2").style.display = "block";	
			},600)
			setTimeout(function () {
				document.getElementById("nuse").style.display = "block";
				document.getElementById("rope2").style.display = "none";
				document.getElementById("rope").style.display = "block";
				document.getElementById("outcome").style.display = "none";
			},2000)
		}else if(choice === 2){
			setTimeout(function(){
				document.getElementById("head").style.display = "none";
				document.getElementById("noggin").style.display = "block";
				document.getElementById("outcome").style.display = "none";
			},2000)
			document.getElementById("head").style.display = "block";
			document.getElementById("noggin").style.display = "none";
			document.getElementById("outcome").style.display = "block";
		}else if(choice === "win"){
			setTimeout(function(){
				document.getElementById("unicorn").style.display = "none";
				document.getElementById("gallowMan").style.display = "block";
				document.getElementById("outcome").style.display = "none";
			},3000)
			document.getElementById("unicorn").style.display = "block";
			document.getElementById("gallowMan").style.display = "none";
			document.getElementById("outcome").style.display = "block";
		}
	}

	setEndGameState(gameState, timeUntilNextGame){
		// console.log("setting game state END: ", gameState, timeUntilNextGame)
			this.setState({
		        'word':  gameState.word, // keep state immutable
	    		'guessedLetters': gameState.guessedLetters,
	    		'remainingGuesses': gameState.remainingGuesses,
	    		'isDone': gameState.isDone,
	    		'timeUntilNextGame': timeUntilNextGame
			})		
	}

	render() {
		console.log("RENDER ROOM", this.state)
		var guessedLettersUpper = this.state.guessedLetters.map((letter)=>{return letter.toUpperCase()});
		return(
			<div className="room">
				<Outcome 
					show={this.state.isDone} 
					outcome={this.outcome}
					timeUntilNextGame = {this.state.timeUntilNextGame}
					/>
						
				<nav className="navbar navbar-default navbar-static-top">

				  <div className="container navcon">
				    <h1 className="game-title">HANGMAN 2000</h1>
				  <select name="select" className="dropMenu"
				     onChange = {(e) => {
				    	this.state.background = e.target.value;
				    	console.log("back", this.state.background)
				    	this.forceUpdate()
				    }}>
					<option value="snowy" >Snowy winter</option> 
					<option value="desert">Desert</option>
					<option value="sea">Under the sea</option>
				  </select>
				  </div>
				</nav>
				<div class="container">
					<Themes 
						background={this.state.background}
					/>
					<div className="row">
						<div className="col-xs-12 col-sm-2" id="player-col">
							
						</div>	
						<div className="col-xs-9 col-sm-8" id="board-col">
							<GameBoard 
								word={this.state.word} 
								guessedLetters={guessedLettersUpper} 
								remainingGuesses={this.state.remainingGuesses} 
								serverAPI = {this.serverAPI}
								coolDown = {this.state.coolDown}
								hintPicUrl = {this.state.hintPic} 
								/>
						</div>
						<div className="col-xs-3 col-sm-2" id="gallows-col">
							<Gallows remainingGuesses={this.state.remainingGuesses} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
