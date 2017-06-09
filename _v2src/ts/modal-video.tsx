/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as _ from 'lodash';
import * as $ from 'jquery';

import {EventEmitter} from './event-emitter';
import {VideoSpec} from './video-roll';

interface Props {
	video: VideoSpec
	eventEmitter: EventEmitter
	onClose: ()=>void
}

interface State {
	height: number
	width: number
}

const WIDTH = 640;
const HEIGHT = 360;
const RATIO = WIDTH / HEIGHT;

export class ModalVideo extends React.Component<Props, State> {
	_handleResize: ()=>void;
	_unsub: ()=>void;
	constructor(props:Props) {
		super(props);
		this.state = {
			height: HEIGHT,
			width: WIDTH
		}
		this._handleResize = _.debounce(this.handleResize.bind(this), 25);
	}
	componentDidMount() {
		this._unsub = this.props.eventEmitter.on("resize", this._handleResize);
		//TODO: HACK ALERT
		$("body").addClass("no-scroll");
	}
	componentWillUnmount() {
		this._unsub();
		//TODO: HACK ALERT
		$("body").removeClass("no-scroll");
	}
	handleResize(evt:Event) {
		var ww = $(window).width();
		var wh = $(window).height();
		if (ww > WIDTH && wh > HEIGHT) {
			this.setState({
				height: HEIGHT,
				width: WIDTH
			});
		} else {
			var nr = ww / wh;
			if (nr > RATIO) {
				this.setState({
					width: wh * RATIO,
					height: wh
				});
			} else {
				this.setState({
					width: ww,
					height: ww / RATIO
				});
			}
		}
	}
	render() {
		var video = this.props.video;
		var modalStyle = {
			width: this.state.width,
			height: this.state.height,
			marginTop: 0 - (this.state.height / 2)
		};
		return (
			<div className="modal video-modal">
				<div className="modal-background"></div>
				<div className="modal-close" onClick={this.props.onClose}>
					<span className="oi" data-glyph="circle-x" title="close" aria-hidden="true"></span>
				</div>
				<div className="modal-content-container">
					<div className="modal-content" style={modalStyle}>
						<iframe width={this.state.width} height={this.state.height} src={video.video} frameBorder="0" allowFullScreen></iframe>
					</div>
				</div>
			</div>
		);
	}
}
