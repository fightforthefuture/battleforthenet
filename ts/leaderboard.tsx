import * as React from 'react';
import * as _ from 'lodash';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';

import {LeaderboardTemplate} from './templates';


export interface LeaderboardReferrer {
	code: string
	n: number
}

interface LeaderboardStats {
	completed: number
	last_day: number
	last_week: number
	top_referrers: LeaderboardReferrer[]
}

export interface LeaderboardProps {
	statsEndpoint: string
	filterCodes: string[]
	filterPattern: RegExp
	n: number
}

export interface LeaderboardState {
	leaderboardStats: LeaderboardStats | null
}


function getLeaderboardStats(props:LeaderboardProps): Promise<LeaderboardStats> {
	return ajaxPromise({
		url: props.statsEndpoint,
		method: "get",
		json: true
	}).then(function(response: Response) {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error("Bad response");
		}
	}).then(function(j: any) {
		var pairs = _.toPairs(j["referral_codes"]);
		var filtered = _.filter(pairs, function(v) {
			return (
				(_.indexOf(props.filterCodes, v[0]) !== 0) &&
				(!props.filterPattern.test(v[0]))
			); 
		});
		var referrers = _.map(filtered, function(v) {
			return {
				code: v[0],
				n: v[1]
			} as LeaderboardReferrer;
		});
		var sorted = _.sortBy(referrers, ["n"]);
		return {
			"completed": j["completed"],
			"last_day": j["last_24h"],
			"last_week": j["last_week"],
			"top_referrers": _.take(sorted, props.n)
		};
	});
}


export class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {
	constructor(props: LeaderboardProps) {
		super(props);
		this.state = {
			"leaderboardStats": null
		};
	}
	componentDidMount() {
		getLeaderboardStats(this.props).then((leaderboardStats:LeaderboardStats) => {
			this.setState({
				leaderboardStats: leaderboardStats
			} as LeaderboardState);
		});
	}
	render() {
		return LeaderboardTemplate(this.props, this.state);
	}
}
