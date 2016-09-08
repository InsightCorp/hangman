import React from 'react';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class ShowPicture extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
		console.log("componentDidMount")
		// this.props.serverAPI.getImageUrl(function(hint){
		// 	console.log('hint.url: ',hint.url)
		// })
	}

	render() {
		return ( 
			<div className = "hintPicture"> 
				<div><img src={this.props.hintPicUrl} className="img-responsive"/></div>
			</div>
		)
	}
}
