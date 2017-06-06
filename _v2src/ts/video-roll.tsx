/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';

function clamp(v: number, l: number): number {
	if (v < 0) {
		return v + l;
	}
	return v % l;
}

interface VideoSpec {
	video: string,
	thumb: string,
	heading: string,
	subHeading: string
}

interface Props {
	videos: VideoSpec[]
	width: number
	height: number
	padding: number
	active_items: number
}

interface State {
	active: number
	open: number | null
}

export class VideoRollComponent extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {
			active: 0,
			open: null
		};
	}
	onPrev(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return {
				active: Math.max(prevState.active - 1, 0),
				open: prevState.open
			}
		});
	}
	onNext(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return {
				active: Math.min(prevState.active + 1, this.props.videos.length),
				open: prevState.open
			};
		});
	}
	closeModal(evt: Event): void {
		this.setState((prevState) => {
			return {
				active: prevState.active,
				open: null
			};
		});
	}
	setOpen(i: number): void {
		this.setState((prevState) => {
			return {
				active: prevState.active,
				open: i
			};
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
			return (
				<div className="video-modal">
					<div className="modal-background"></div>
					<div className="modal-close" onClick={this.closeModal.bind(this)}>
						<span className="oi" data-glyph="circle-x" title="close" aria-hidden="true"></span>
					</div>
					<div className="modal-content-container">
						<div className="modal-content">
							<iframe width="640" height="360" src={video.video} frameborder="0" allowfullscreen></iframe>
						</div>
					</div>
				</div>
			);
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
