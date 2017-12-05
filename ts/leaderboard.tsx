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
	filterCodes: RegExp[]
	showMoreAt: number
	limit: number
}

export interface LeaderboardState {
	leaderboardStats: LeaderboardStats | null
	open: boolean
}

export interface LeaderboardContext {
	onOpen: any
}

let matchDomain = /(https?:\/\/[^\/]+\/)/i;
function cleanCode(s:string) {
	var m = s.match(matchDomain);
	if (m) {
		return m[0];
	}
	return s;
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
			return _.every(props.filterCodes, function(re) {
				return !re.test(v[0]);
			});
		});
		var referrers:{[key:string]: LeaderboardReferrer} = {};
		_.each(j["referral_codes"] as {[key:string]: number}, function(v, k) {
			var check:boolean = _.every(props.filterCodes, function(re) {
				return !re.test(k);
			});
			if (check) {
				var code = cleanCode(k);
				if (!referrers[code]) {
					referrers[code] = {
						"code": code,
						"n": 0
					};
				}
				referrers[code].n += v;
			}
		});
		var sorted = _.orderBy(referrers, ["n"], ["desc"]);
		return {
			"completed": j["completed"],
			"last_day": j["last_24h"],
			"last_week": j["last_week"],
			"top_referrers": _.take(sorted, props.limit)
		};
	});
}


export class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {
	constructor(props: LeaderboardProps) {
		super(props);
		this.state = {
			"leaderboardStats": null,
			"open": false
		};
	}
	componentDidMount() {
		getLeaderboardStats(this.props).then((leaderboardStats:LeaderboardStats) => {
			this.setState({
				leaderboardStats: leaderboardStats,
				open: !(leaderboardStats.top_referrers.length > this.props.showMoreAt)
			} as LeaderboardState);
		});
	}
	onOpen() {
		this.setState({
			open: true
		} as LeaderboardState);
	}
	render() {
		var ctx = {
			onOpen: this.onOpen.bind(this)
		};
		return LeaderboardTemplate(this.props, this.state, ctx);
	}
}
