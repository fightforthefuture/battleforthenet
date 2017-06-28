import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';

import {daysUntil} from './utils';


interface Props {
	deadline: Date
}

interface LoadedState {
	loaded: true,
	comments: number,
	calls: number,
	emails: number,
	startups: number,
	internets: number,
	days: number
}
interface UnloadedState {
	loaded: false,
}

export class StatsComponent extends React.Component<Props, LoadedState | UnloadedState> {
	constructor(props:Props) {
		super(props);
		this.state = {
			loaded: false,
			comments: null,
			calls: null,
			emails: null,
			startups: 1000,
			internets: 1,
			days: null
		};
	}
	componentDidMount() {
		this.loadStats();
	}
	loadStats() {
		const daysLeft = daysUntil(this.props.deadline);
		let newState = _.clone(this.state) as LoadedState;
		newState.loaded = true;
		newState.comments = 432023;
		newState.calls = 12003;
		newState.emails = 1213123;
		newState.days = daysLeft;
		this.setState(newState);
	}
	renderStats(stats: LoadedState) {
		function format(n:number): string {
			return n.toLocaleString();
		}
		const dayLabel = (stats.days > 1) ? "days" : "day";
		return (
			<div className="unit">
				<span>{ format(stats.comments) }</span> comments.{" "}
				<span>{ format(stats.calls) }</span> calls.{" "}
				<span>{ format(stats.emails) }</span> emails to Congress.{" "}
				<span>{ stats.startups }+</span> startups.{" "}
				<span>{ format(stats.internets) } Internet to save.</span>{" "}
				<span>{ stats.days } { dayLabel } left.</span>
			</div>
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
				{ this.state.loaded ? this.renderStats(this.state as LoadedState) : null }
			</ReactTransitionGroup.CSSTransitionGroup>
		);
	}
}
