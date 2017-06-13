/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {DOMWrapper} from './dom-wrapper';
import {EventEmitter} from './event-emitter';

interface Props {
	top: number,
	element: Node,
	eventEmitter: EventEmitter
}

interface State {
	toggle: boolean
}

export class ScrollToggler extends React.Component<Props, State> {
	_handleScroll: ()=>void;
	_unsub: ()=>void;
	constructor(props:Props) {
		super(props);
		this.state = {
			toggle: false
		}
		this._handleScroll = _.debounce(this.handleScroll.bind(this), 25);
	}
	componentDidMount() {
		this._unsub = this.props.eventEmitter.on("scroll", this._handleScroll);
	}
	componentWillUnmount() {
		this._unsub();
	}
	handleScroll(evt:Event) {
		var scrollTop = $(evt.currentTarget).scrollTop();
		this.setState({
			toggle: scrollTop > this.props.top
		});
	}
	render() {
		return <div className={"toggle-" + (this.state.toggle ? "true" : "false")}>
			<DOMWrapper element={this.props.element} />
		</div>;
	}

	static wrapElement(target: HTMLElement, top: number, eventEmitter: EventEmitter) {
		if (target.parentElement instanceof HTMLElement) {
			const parent = target.parentElement;
			const child = parent.removeChild(target);
			var props = {
				top: top,
				element: child,
				eventEmitter: eventEmitter
			};
			const c = React.createElement(ScrollToggler, props);
			ReactDOM.render(c, parent);
		}
	}
}
