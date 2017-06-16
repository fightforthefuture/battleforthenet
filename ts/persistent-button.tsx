/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {DOMWrapper} from './dom-wrapper';
import {EventEmitter} from './event-emitter';
import {getScrollTop} from './utils';

interface Props {
	text: string
	desktopTop: number
	mobileTop: number
	eventEmitter: EventEmitter
}

interface State {
	toggle: boolean
}

export class PersistentButton extends React.Component<Props, State> {
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
		this._unsub = this.props.eventEmitter.on("all", this._handleScroll);
	}
	componentWillUnmount() {
		this._unsub();
	}
	handleScroll(evt:Event) {
		var scrollTop = getScrollTop();
		var ww = window.innerWidth;
		var top: number;
		if (ww < 930) {
			top = this.props.mobileTop
		} else {
			top = this.props.desktopTop
		}
		this.setState({
			toggle: scrollTop > top
		});
	}
	render() {
		return <div className={"toggle-" + (this.state.toggle ? "true" : "false")}>
			<div className="persistent-button">
				<a className="btn" href="#">{ this.props.text }</a>
			</div>
		</div>;
	}
}
