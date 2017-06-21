/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactTransitionGroup from 'react-transition-group';

import {Modal} from './modal';

interface Props {
	enabled: boolean
}

interface State {
	enabled: boolean
}

export class TwitterBrigade extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		// Need to shadow provided prop with controllable var
		// so the modal can close itself
		this.state = {
			enabled: props.enabled
		};
	}
	onClose() {
		this.setState({
			enabled: false
		} as State);
	}
	renderModal() {
		return (
			<Modal onClose={this.onClose.bind(this)} modalClass="twitter-modal">
				<div>
					<h2>Join with Twitter to defend the Internet!</h2>
					<p>There are countless battles that need to be won to keep the Internet open. From protecting net neutrality to stopping secret deals that could censor the net, we need your help. Will you let us automatically post urgent alerts from your Twitter account, about once a week? (You can <a href="https://support.twitter.com/articles/76052-connecting-or-revoking-third-party-applications#revokeaccess">opt out</a> at any time, of course.)</p>
					<form action="https://radiant-earth-4575.herokuapp.com/auth/twitter_prep" method="POST">
						<input type="hidden" name="frequency" value="1" />
						<button className="btn" type="submit">
							<img src="/images/share/twitter_white.svg" />
							<span>Join with Twitter</span>
						</button>
					</form>
					<p className="notice">
						<a href="https://twitter.com/intent/tweet?related=fightfortheftr&text=ISPs should *not* control what we read/watch/say online. That’s %23NetNeutrality %26 now it's under attack. Defend it! https://www.battleforthenet.com" target="_blank">Nope, just tweet once</a>
					</p>
				</div>
			</Modal>
		);
	}
	render() {
		return (
			<ReactTransitionGroup.CSSTransitionGroup
				component="div"
				transitionName="fadein"
				transitionAppear={true}
				transitionAppearTimeout={500}
				transitionEnter={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}>
				{ this.state.enabled ? this.renderModal() : null }
			</ReactTransitionGroup.CSSTransitionGroup>
		);
	}
}
