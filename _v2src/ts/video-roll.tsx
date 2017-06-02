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
				active: clamp(prevState.active - 1, this.props.videos.length),
				open: prevState.open
			}
		});
	}
	onNext(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return {
				active: clamp(prevState.active + 1, this.props.videos.length),
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
		var l = this.props.active_items * (this.props.width + this.props.padding);
		return (
			<div className="controls">
				<a className="prev" onClick={this.onPrev.bind(this)} style={{left: -50}}>{"\u00AB"}</a>
				<a className="next" onClick={this.onNext.bind(this)} style={{left: l}}>{"\u00BB"}</a>
			</div>
		);
	}
	renderVideo(offset: number): JSX.Element {
		var n = this.props.videos.length;
		var idx = clamp(this.state.active + offset, n)
		var video = this.props.videos[idx];
		var left = offset * (this.props.width + this.props.padding);
		var opacity = 1.0;
		if (offset < 0) {
			opacity = Math.max(0, 1.0 + (offset * 0.75));
		} else if (offset > 2) {
			opacity = Math.min(1.0, 1.0 - ((offset - 2) * 0.75));
		}
		var openVideo = function(evt: Event) {
			evt.preventDefault();
			this.setOpen(idx);
		};
		return <div className="video" key={"video-" + idx} style={{left: left, width: this.props.width, opacity: opacity}}>
			<div className="play" onClick={openVideo.bind(this)}>PLAY</div>
			<img src={video.thumb} style={{left: left, width: this.props.width, height: this.props.height }} />
			<p>
				<span>{video.heading}</span>
				{video.subHeading}
			</p>
		</div>;
	}
	renderVideos(): JSX.Element[] {
		return [
			this.renderVideo(-2),
			this.renderVideo(-1),
			this.renderVideo(0),
			this.renderVideo(1),
			this.renderVideo(2),
			this.renderVideo(3),
			this.renderVideo(4)
		];
	}
	renderModalContents(): JSX.Element|null {
		if (typeof this.state.open === "number") {
			const video = this.props.videos[this.state.open];
			return (
				<div className="video-modal">
					<div className="modal-background"></div>
					<div className="modal-close" onClick={this.closeModal.bind(this)}>
						X
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
				{this.renderControls()}
				{this.renderVideos()}
				{this.renderModal()}
			</div>
		);
	}
}
