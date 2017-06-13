/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';

import {EventEmitter} from './event-emitter';
import {ModalVideo} from './modal-video';

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
	modalSize: number | null
}

export class VideoRollComponent extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {
			active: Math.floor(props.videos.length / 2),
			open: null,
			modalSize: null
		};
	}
	onPrev(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return _.defaults({
				active: Math.max(prevState.active - 1, 0)
			}, prevState) as State;
		});
	}
	onNext(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return _.defaults({
				active: Math.min(prevState.active + 1, this.props.videos.length - 1)
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
	renderVideo(video: VideoSpec, n: number): JSX.Element {
		var left = n * (this.props.width + this.props.padding);
		var openVideo = function(evt: Event) {
			evt.preventDefault();
			this.setOpen(n);
		};
		return (
			<div className="video" key={"video-" + n} style={{left: left, width: this.props.width}}>
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
		var left = this.state.active * (this.props.width + this.props.padding);
		return (
			<div className="video-container">
				<div className="video-scroller" style={{left: -left}}>
					{_.map(this.props.videos, this.renderVideo.bind(this))}
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
