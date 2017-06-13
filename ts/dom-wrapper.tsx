/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
	element: Node 
}

interface State {}

export class DOMWrapper extends React.Component<Props, State> {
	shouldComponentUpdate() {
		return false;
	}
	componentDidMount() {
		console.log(this.props);
		var node = ReactDOM.findDOMNode(this);
		node.appendChild(this.props.element);
	}
	render() {
		return <div></div>
	}
}
