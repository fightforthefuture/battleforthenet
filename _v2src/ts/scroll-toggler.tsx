/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {DOMWrapper} from './dom-wrapper';

interface Props {
	top: number,
	element: Node 
}

interface State {
	toggle: boolean
}

export class ScrollToggler extends React.Component<Props, State> {
	_handleScroll: ()=>void;
	constructor(props:Props) {
		super(props);
		this.state = {
			toggle: false
		}
		this._handleScroll = _.debounce(this.handleScroll.bind(this), 100);
	}
	componentDidMount() {
		window.addEventListener('scroll', this._handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this._handleScroll);
	}
	handleScroll() {
		this.setState({
			toggle: (document.documentElement.scrollTop > this.props.top)
		});
	}
	render() {
		return <div className={"toggle-" + (this.state.toggle ? "true" : "false")}>
			<DOMWrapper element={this.props.element} />
		</div>;
	}

	static wrapElement(target: HTMLElement, top: number) {
		if (target.parentElement instanceof HTMLElement) {
			const parent = target.parentElement;
			const child = parent.removeChild(target);
			var props = {
				top: top,
				element: child
			};
			const c = React.createElement(ScrollToggler, props);
			ReactDOM.render(c, parent);
		}
	}
}
