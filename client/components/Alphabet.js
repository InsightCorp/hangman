import React from 'react';


export default class Alphabet extends React.Component {

	constructor(props) {
		super(props);
	}

	isActive(){
		return 'alphabet '+ ((this.props.guessed) ? 'alphabet-guessed':'alphabet-active');
	}

	onAlphabetClick(e){
		console.log(this.props.alphabet);
		if(!this.props.guessed){
			this.props.serverAPI.makeGuess(this.props.alphabet);
		}
	}

	render() {
		console.log('it works')
		return ( 
			< div className = {this.isActive()} onClick = {(e)=>{this.onAlphabetClick(e)}}> 
				{ this.props.alphabet} 
			< /div>
		)
	}
}