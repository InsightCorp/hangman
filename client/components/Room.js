import React from 'react';
import ServerAPI from '../models/ServerAPI';
import GameBoard from './GameBoard';
import Gallows from './Gallows.js';
import Outcome from './Outcome.js';
import Players from './Players';
import Dropdown from 'react-simple-dropdown';

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
			background: "snowy"
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
			this.setState({
				'players' : playerList,
		        'word':  res.gameState.word,
	    		'guessedLetters': res.gameState.guessedLetters,
	    		'remainingGuesses': res.gameState.remainingGuesses,
	    		'isDone': res.gameState.isDone
			});
		})

		// Update players
		this.serverAPI.onPlayerEnterRoom((res)=>{
			console.log("Player enter room", res, this.state);
			var playerList = this.state.players;
			console.log("playerlist: ", playerList)
			playerList.push(res.playerId);
			this.setState({
				players: playerList
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

	componentDidMount() {
	    function drawSnow(){
			//canvas init
			var canvas = document.getElementById("snowy");
			var ctx = canvas.getContext("2d");
			
			//canvas dimensions
			var W = window.innerWidth;
			var H = window.innerHeight;
			canvas.width = W;
			canvas.height = H;
			
			//snowflake particles
			var mp = 25; //max particles
			var particles = [];
			for(var i = 0; i < mp; i++)	{
				particles.push({
					x: Math.random()*W, //x-coordinate
					y: Math.random()*H, //y-coordinate
					r: Math.random()*4+1, //radius
					d: Math.random()*mp //density
				})
			}
			
			//Lets draw the flakes
			function draw()	{
				ctx.clearRect(0, 0, W, H);
				
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				ctx.beginPath();
				for(var i = 0; i < mp; i++)	{
					var p = particles[i];
					ctx.moveTo(p.x, p.y);
					ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
				}
				ctx.fill();
				update();
			}
			
			//Function to move the snowflakes
			//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
			var angle = 0;
			function update() {
				angle += 0.01;
				for(var i = 0; i < mp; i++) {
					var p = particles[i];
					//Updating X and Y coordinates
					//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
					//Every particle has its own density which can be used to make the downward movement different for each flake
					//Lets make it more random by adding in the radius
					p.y += Math.cos(angle+p.d) + 1 + p.r/2;
					p.x += Math.sin(angle) * 2;
					
					//Sending flakes back from the top when it exits
					//Lets make it a bit more organic and let flakes enter from the left and right also.
					if(p.x > W+5 || p.x < -5 || p.y > H) {
						if(i%3 > 0) { //66.67% of the flakes
							particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
						}
						else {
							//If the flake is exitting from the right
							if(Math.sin(angle) > 0) {
								//Enter from the left
								particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
							}
							else {
								//Enter from the right
								particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
							}
						}
					}
				}
			}
			
			//animation loop
			setInterval(draw, 33);
		}

		drawSnow();
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
				    <h1 className="game-title">HANGMAN</h1>
				    <select name="select" 
				     onChange = {(e) => {
				    	console.log(e.target.value)
				    	this.state.background = e.target.value;
				    	this.forceUpdate()
				    }}>
					  <option value="snowy" >Snowy winter</option> 
					  <option value="desert">Desert</option>
					  <option value="sea">Under the sea</option>
					</select>
				  </div>
				</nav>
				<canvas id={this.state.background} class="canvas"></canvas>
				<div class="container">
					<div className="row">
						<div className="col-xs-12 col-sm-2" id="player-col">
							<Players players={this.state.players}/>
						</div>	
						<div className="col-xs-9 col-sm-8" id="board-col">
							<GameBoard 
								word={this.state.word} 
								guessedLetters={guessedLettersUpper} 
								remainingGuesses={this.state.remainingGuesses} 
								serverAPI = {this.serverAPI}
								coolDown = {this.state.coolDown}
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
