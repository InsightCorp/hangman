import React from 'react';

export default class Gallows extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div className="gallows">
				<svg width="200" height="800" >
					
					<g id="gallowRope">
						<line id="rope" x1="100" y1="0" x2="100" y2="165" />
						<line id="rope2" x1="100" y1="0" x2="100" y2="165" >
			 			<animate attributeName="x2"
		                 attributeType="XML"
		                 dur="3s"
		                 values="100 ; 140 ; 60 ; 140 ; 100"
		                 keyTimes="0 ; 0.25 ; 0.5 ; 0.75 ; 1"
		                 repeatCount="indefinite"/>

						</line>
						<circle id="nuse" cx="100" cy="175" r="16" />
					</g>
					<g id="gallowMan">
						<circle id="noggin" 
							className={this.props.remainingGuesses < 6 ? "op-on" : "op-off"}
							cx="100" cy="158" r="30" />
						<circle id="head" 
							className={this.props.remainingGuesses < 6 ? "op-on" : "op-off"}
							cx="100" cy="158" r="30">
							<animate attributeName="cy"
			                 attributeType="XML"
			                 dur="3s"
			                 values="158 ; 400 ; 800"
			                 keyTimes="0 ; 0.5; 1"
			                 repeatCount="indefinite"/>
							</circle>
						<line id="torso" 
							className={this.props.remainingGuesses < 5 ? "op-on" : "op-off"}
							x1="100" y1="193" x2="100" y2="290" />
						<line id="arm-left" 
							className={this.props.remainingGuesses < 4 ? "op-on" : "op-off"}
							x1="100" y1="220" x2="45" y2="250" />
						<line id="the-swords" 
							className={this.props.remainingGuesses < 4 ? "op-on" : "op-off"}
							x1="45" y1="250" x2="40" y2="150" />
						<line id="the-swords-handle" 
							className={this.props.remainingGuesses < 4 ? "op-on" : "op-off"}
							x1="30" y1="225" x2="60" y2="223" />
						<line id="arm-right" 
							className={this.props.remainingGuesses < 3 ? "op-on" : "op-off"}
							x1="100" y1="220" x2="155" y2="250" />
						<line id="leg-left" 
							className={this.props.remainingGuesses < 2 ? "op-on" : "op-off"}
							x1="100" y1="285" x2="55" y2="350" />
						<line id="leg-right" 
							className={this.props.remainingGuesses < 1 ? "op-on" : "op-off"}
							x1="100" y1="285" x2="145" y2="350" />
					</g>
				</svg>
			</div>
		)
	}

}

