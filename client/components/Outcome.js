 
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class Outcome extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			show: false
		}
	}

	onPlayAgain(){
		this.props.models.playAgain();
	}

	// componentWillReceiveProps(){
	// 	console.log("OUTCOME RECEIVEPROPS", this.props);
	// 	this.setState({
	// 		show: this.props.show
	// 	})
	// }

	close(){
		this.setState({
			show: false
		})
	}

	render() {
		// if(this.state.show){
		// 	var now = new Date();
		// 	var remaining = (this.props.timeUntilNextGame-now)/1000;
		// 	setTimeout(this.updateState.bind(this, remaining), 100)			
		// }

	var timeLeft = (this.props.timeUntilNextGame - (new Date()).getTime())/1000;
	this.state.show = this.props.show && (timeLeft >0);
	return ( 
	  <div id="outcome">
			<h1>{this.props.outcome.win?"WIN :D":"YOU, LOSE :("}	</h1>
	  </div>
	)
	}
}

