import React from 'react';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Themes extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			background: props.background,
			snowInt: 55
		}
	}
	componentWillReceiveProps(){
		this.setState({background: document.getElementsByClassName("dropMenu")[0].value})
		// this.state.background= document.getElementsByClassName("dropMenu")[0].value;
	}
	componentDidUpdate() {

		console.log("themes state", this.state)
		if (this.state.background === "snowy"){
		 	this.state.snowInt= 55
		}
		if (this.state.background !== "snowy"){
		 	this.state.snowInt= 0
		}
		
	}
	componentDidMount(){
		var that = this;
		console.log("loading snow first time!")

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
					var particles = [];
					for(var i = 0; i < that.state.snowInt; i++)	{
						particles.push({
							x: Math.random()*W, //x-coordinate
							y: Math.random()*H, //y-coordinate
							r: Math.random()*4+1, //radius
							d: Math.random()*that.state.snowInt //density
						})
					}
					
					//Lets draw the flakes
					function draw()	{
						ctx.clearRect(0, 0, W, H);
						
						ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
						ctx.beginPath();
						for(var i = 0; i < that.state.snowInt; i++)	{
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
						for(var i = 0; i < that.state.snowInt; i++) {
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
					setInterval(draw, 33)		
				}
			drawSnow()
	}
	render() {
		return ( 
		<div>
			<canvas className="back" id={this.state.background}></canvas>
		</div>
		)
	}
}
