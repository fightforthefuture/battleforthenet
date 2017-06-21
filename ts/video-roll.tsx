/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';
import * as Hammer from 'react-hammerjs';

import {EventEmitter} from './event-emitter';
import {ModalVideo} from './modal-video';
import {clamp, classes} from './utils';

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
	pagePadding: number
	eventEmitter: EventEmitter
}


interface State {
	active: number
	open: number | null
	visibleVideos: number
	width: number
	height: number
}


interface VideoPosition {
	idx: number
	spec: VideoSpec
	left: number
	active: boolean
	isEndCap: boolean
}


function getVisibleVideos(props:Props): number {
	var ww = window.innerWidth - (props.pagePadding * 2);
	return Math.floor(ww / (props.width + props.padding));
}


function getContainerPadding(props:Props, state:State): number {
	var ww = window.innerWidth;
	return Math.floor((ww - (state.visibleVideos * (state.width + props.padding))) / 2);
}


function getVideoPositions(props:Props, state:State): VideoPosition[] {
	var l = props.videos.length;
	var s = Math.floor((l - state.visibleVideos) / 2);
	var i = clamp(state.active - s, l);
	var left = -s;
	var ret: VideoPosition[] = [];
	_.each(_.range(0, l), function(j) {
		var idx = clamp(i + j, l);
		var offset = left + j;
		ret[idx] = {
			idx: idx,
			spec: props.videos[idx],
			left: offset,
			active: (offset < state.visibleVideos) && (offset >= 0),
			isEndCap: (j === 0 || j === (l - 1))
		};
	});
	return ret;
}


export class VideoRollComponent extends React.Component<Props, State> {
	_handleResize: ()=>void;
	_unsub: ()=>void;
	constructor(props:Props) {
		super(props);
		this.state = {
			active: 0,
			open: null,
			visibleVideos: Math.max(1, getVisibleVideos(props)),
			width: props.width,
			height: props.height
		};
		this._handleResize = _.debounce(this.handleResize.bind(this), 25);
	}
	componentDidMount() {
		this._unsub = this.props.eventEmitter.on("resize", this._handleResize);
		this._handleResize();
	}
	componentWillUnmount() {
		this._unsub();
	}
	handleResize(evt:Event) {
		var v = getVisibleVideos(this.props);
		var h = this.props.height;
		var w = this.props.width;
		if (v < 1) {
			v = 1;
			var ratio = h / w;
			w = Math.floor(window.innerWidth - this.props.pagePadding);
			h = Math.floor(w * ratio);
		}
		this.setState({
			visibleVideos: v,
			width: w,
			height: h
		} as State);
	}
	onSwipe(evt: Event): void {
		evt.preventDefault();
		var d = (evt as any)["direction"] as number;
		if (d) {
			if (d === 2) {
				this.setState((prevState) => {
					return _.defaults({
						active: clamp(prevState.active + 1, this.props.videos.length)
					}, prevState) as State;
				});
			} else if (d === 4) {
				this.setState((prevState) => {
					return _.defaults({
						active: clamp(prevState.active - 1, this.props.videos.length)
					}, prevState) as State;
				});
			}
		}
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
		var padding = getContainerPadding(this.props, this.state);
		return (
			<div className="controls">
				<div className="bar">
					<div className="section" style={{width: width, left: left}}></div>
				</div>
				<div className="prev" onClick={this.onPrev.bind(this)} style={{width: padding}}>
					<div>
						<span className="oi" data-glyph="chevron-left" title="previous" aria-hidden="true"></span>
					</div>
				</div>
				<div className="next" onClick={this.onNext.bind(this)} style={{width: padding}}>
					<div>
						<span className="oi" data-glyph="chevron-right" title="next" aria-hidden="true"></span>
					</div>
				</div>
			</div>
		);
	}
	renderVideo(vp: VideoPosition): JSX.Element {
		var idx = vp.idx;
		var video = vp.spec;
		var left = vp.left * (this.state.width + this.props.padding);
		var openVideo = function(evt: Event) {
			evt.preventDefault();
			this.setOpen(idx);
		};
		return (
			<div className={classes("video", vp.isEndCap && "video-end", vp.active && "video-active") } key={"video-" + idx} style={{left: left, width: this.state.width}}>
				<div className="thumb" style={{width: this.state.width, height: this.state.height}} onClick={vp.active ? openVideo.bind(this) : void(0)}>
					<div className="veneer"></div>
					<img src={video.thumb} />
				</div>
				<p>
					<span>{video.heading}</span>
					{video.subHeading}
				</p>
				<div className="play" onClick={openVideo.bind(this)} style={{width: this.state.width, height: this.state.height}}>
					<div className="wrapper">
						<div className="circle">
							<span className="oi" data-glyph="media-play" title="play" aria-hidden="true"></span>
						</div>
					</div>
				</div>
			</div>
		);
	}
	renderVideos(): JSX.Element {
		var videoPositions = getVideoPositions(this.props, this.state);
		var left = getContainerPadding(this.props, this.state);
		return (
			<Hammer onSwipe={this.onSwipe.bind(this)}>
				<div className="video-container">
					<div className="video-scroller" style={{left: left}}>
						{_.map(videoPositions, this.renderVideo.bind(this))}
					</div>
				</div>
			</Hammer>
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
