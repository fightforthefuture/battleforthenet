/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';

import {EventEmitter} from './event-emitter';
import {ModalVideo} from './modal-video';
import {clamp} from './utils';

export interface VideoSpec {
	video: string
	thumb: string
	heading: string
	subHeading: string
}

interface Props {
	videos: VideoSpec[]
	width: number
	height: number
	padding: number
	eventEmitter: EventEmitter
}

interface State {
	active: number
	open: number | null
	visibleVideos: number
}

interface VideoPosition {
	idx: number
	spec: VideoSpec
	left: number
	isEndCap: boolean
}

function getVisibleVideos(props:Props): number {
	var ww = window.innerWidth;
	var ret = Math.floor(ww / (props.width + props.padding));
	return Math.max(1, ret);
}

function getVideoPositions(props:Props, state:State): VideoPosition[] {
	var l = props.videos.length;
	var s = Math.floor((l - state.visibleVideos) / 2);
	var i = clamp(state.active - s, l);
	var left = -s;
	console.log(l, s, i, left);
	return _.sortBy(_.map(_.range(0, l), function(j) {
		var idx = clamp(i + j, l);
		return {
			idx: idx,
			spec: props.videos[idx],
			left: left + j,
			isEndCap: (j === 0 || j === (l - 1))
		}
	}), "idx");
}

export class VideoRollComponent extends React.Component<Props, State> {
	_handleResize: ()=>void;
	_unsub: ()=>void;
	constructor(props:Props) {
		super(props);
		this.state = {
			active: 0,
			open: null,
			visibleVideos: getVisibleVideos(props)
		};
		this._handleResize = _.debounce(this.handleResize.bind(this), 25);
	}
	componentDidMount() {
		this._unsub = this.props.eventEmitter.on("resize", this._handleResize);
	}
	componentWillUnmount() {
		this._unsub();
	}
	handleResize(evt:Event) {
		this.setState({
			visibleVideos: getVisibleVideos(this.props)
		} as State);
	}
	onPrev(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return _.defaults({
				active: clamp(prevState.active - 1, this.props.videos.length)
			}, prevState) as State;
		});
	}
	onNext(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return _.defaults({
				active: clamp(prevState.active + 1, this.props.videos.length)
			}, prevState) as State;
		});
	}
	closeModal(evt: Event): void {
		this.setState((prevState) => {
			return _.defaults({open: null}, prevState) as State;
		});
	}
	setOpen(i: number): void {
		this.setState((prevState) => {
			return _.defaults({open: i}, prevState) as State;
		});
	}
	renderControls(): JSX.Element {
		var chunk = 100 / this.props.videos.length;
		var width = chunk + "%";
		var left = (chunk * this.state.active) + "%";
		return (
			<div className="controls">
				<div className="bar">
					<div className="section" style={{width: width, left: left}}></div>
				</div>
				<a className="prev" onClick={this.onPrev.bind(this)}>
					<span className="oi" data-glyph="chevron-left" title="previous" aria-hidden="true"></span>
				</a>
				<a className="next" onClick={this.onNext.bind(this)}>
					<span className="oi" data-glyph="chevron-right" title="next" aria-hidden="true"></span>
				</a>
			</div>
		);
	}
	renderVideo(videoPosition: VideoPosition): JSX.Element {
		var idx = videoPosition.idx;
		var video = videoPosition.spec;
		var left = videoPosition.left * (this.props.width + this.props.padding);
		var openVideo = function(evt: Event) {
			evt.preventDefault();
			this.setOpen(idx);
		};
		return (
			<div className={"video" + (videoPosition.isEndCap ? " video-end" : "") } key={"video-" + idx} style={{left: left, width: this.props.width}}>
				<div className="play" onClick={openVideo.bind(this)}>
					<span className="oi" data-glyph="media-play" title="play" aria-hidden="true"></span>
				</div>
				<img src={video.thumb} style={{width: this.props.width, height: this.props.height }} />
				<p>
					<span>{video.heading}</span>
					{video.subHeading}
				</p>
			</div>
		);
	}
	renderVideos(): JSX.Element {
		var videoPositions = getVideoPositions(this.props, this.state);
		console.log(videoPositions);
		return (
			<div className="video-container">
				<div className="video-scroller">
					{_.map(videoPositions, this.renderVideo.bind(this))}
				</div>
			</div>
		);
	}
	renderModalContents(): JSX.Element|null {
		if (typeof this.state.open === "number") {
			const video = this.props.videos[this.state.open];
			return <ModalVideo video={video} eventEmitter={this.props.eventEmitter} onClose={this.closeModal.bind(this)} />
		} else {
			return null;
		}
	}
	renderModal(): JSX.Element {
		return <ReactTransitionGroup.CSSTransitionGroup
			component="div"
			transitionName="fadein"
			transitionAppear={true}
			transitionAppearTimeout={500}
			transitionEnter={true}
			transitionEnterTimeout={500}
			transitionLeaveTimeout={500}>
			{ this.renderModalContents() }
		</ReactTransitionGroup.CSSTransitionGroup>
	}
	render() {
		return (
			<div>
				{this.renderVideos()}
				{this.renderControls()}
				{this.renderModal()}
			</div>
		);
	}
}
