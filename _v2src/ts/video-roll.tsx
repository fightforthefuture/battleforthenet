/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';

function incr(v: number, l: number): number {
	return (v + 1) % l;
}

function decr(v: number, l: number): number {
	var ret = v - 1;
	if (ret < 0) {
		return ret + l;
	}
	return ret;
}

interface VideoSpec {
	video: string,
	thumb: string,
	heading: string,
	subHeading: string
}

interface Props {
	videos: VideoSpec[]
}

interface State {
	active: number
}

export class VideoRollComponent extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {
			active: 0
		};
	}
	onPrev(evt: Event): void {
		this.setState((prevState) => {
			return {
				active: incr(prevState.active, this.props.videos.length)
			}
		});
	}
	onNext(evt: Event): void {
		this.setState((prevState) => {
			return {
				active: decr(prevState.active, this.props.videos.length)
			}
		});
	}
	renderControls(): JSX.Element {
		return (
			<div className="controls">
				<a className="prev" onClick={this.onPrev.bind(this)}>{"\u00AB"}</a>
				<a className="next" onClick={this.onNext.bind(this)}>{"\u00BB"}</a>
			</div>
		);
	}
	renderVideo(video: VideoSpec, idx: number, className: string): JSX.Element {
		return <div className={"video " + className} key={"video-" + idx}>
			<div className="play">PLAY</div>
			<img src={video.thumb} />
			<p>
				<span>{video.heading}</span>
				{video.subHeading}
			</p>
		</div>;
	}
	renderVideos(): JSX.Element[] {
		const l = this.props.videos.length;
		const i = this.state.active;
		const next = incr(i, l);
		const prev = decr(i, l);
		return [
			this.renderVideo(this.props.videos[prev], prev, "video-prev"),
			this.renderVideo(this.props.videos[i], i, "video-active"),
			this.renderVideo(this.props.videos[next], next, "video-next"),
		];
	}
	render() {
		return (
			<div>
				{this.renderControls()}
				<ReactTransitionGroup.CSSTransitionGroup
					component="div"
					transitionName="fadein"
					transitionAppear={true}
					transitionAppearTimeout={500}
					transitionEnter={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{this.renderVideos()}
				</ReactTransitionGroup.CSSTransitionGroup>
			</div>
		);
	}
}
