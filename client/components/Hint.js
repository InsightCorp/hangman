import React from 'react';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ShowPicture from './ShowPicture'

export default class Hint extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		  showComponent: false,
		};
		this.trackClicks = 0,
		this._onButtonClick = this._onButtonClick.bind(this);
	}

	_onButtonClick() {
		this.trackClicks += 1;
		console.log("this.trackClicks: ",this.trackClicks)
		if (this.trackClicks %2 === 0){
			this.setState({
			  showComponent: false,
			});
		}
		else{
			this.setState({
			  showComponent: true,
			});
		}
	}

	render() {
		return ( 
			<div className = "hint"> 
				<button className="btn btn-lg btn-danger" onClick={this._onButtonClick}> Hint ? </button>
				{this.state.showComponent ?
					<ShowPicture hintPicUrl={this.props.hintPicUrl} /> : null
				}
			</div>
		)
	}
}
