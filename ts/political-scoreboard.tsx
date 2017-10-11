import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

import {EventEmitter} from './event-emitter';
import {ExternalFlags} from './external-flags';
import {Carousel} from './carousel';
import {ajaxResult, ajaxPromise} from './utils';
import {handleInputChange} from './utils';
import {clamp, classes} from './utils';
import {r} from './r';


function getPoliticianSubdomain(p:any): string {
	var subdomain: string;
	if (p.subdomain) {
		subdomain = p.subdomain;
	} else {
		subdomain = p.first + p.name;
	}
	var host = (p.team == "team-internet") ? ".savesthe.net" : ".breaksthe.net";
	return "http://" + subdomain + host;
}

function getPoliticianTweetLink(p:any): string {
	var shareText: string;
	var l = 140;
	var extra = " battleforthenet.com";
	if (p.sharetext) {
		shareText = p.sharetext;
	} else if (p.team === "team-cable") {
		shareText = `.@${p.twitter}, stop selling out your constituents. Oppose @AjitPaiFCC's plan to gut #NetNeutrality`;
	} else if (p.team === "team-internet") {
		shareText = `.@${p.twitter} thank you for standing up for #NetNeutrality and opposing @AjitPaiFCC's plan.`;
	} else {
		shareText = `.@${p.twitter}, I'm a constituent & #netneutrality rules matter to me. Please oppose @AjitPaiFCC's plan.`;
	}
	if (!p.sharetext) {
		if (shareText.length < l - extra.length) {
			shareText = shareText + extra;
		}
	}
	return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&related=fightfortheftr";
}


function parsePolitician(data:any, idx:number) {
	var imageBaseURL = '/images/scoreboard/';
	var team;
	switch (data.gsx$team.$t) {
		case "team-cable":
		case "team-internet":
			team = data.gsx$team.$t;
			break;
		default:
			team = "undecided";
			break;
	}
	var ret:any = {
		idx: idx,
		frontpage: (data.gsx$frontpage.$t === '1'),
		first: data.gsx$first.$t,
		name: data.gsx$name.$t,
		organization: data.gsx$organization.$t,
		image: imageBaseURL + data.gsx$bioguide.$t + '_x1.jpg',
		image2x: imageBaseURL + data.gsx$bioguide.$t + '_x2.jpg',
		weight: data.gsx$weight.$t,
		team: team,
		size: data.gsx$size.$t,
		meta: data.gsx$meta.$t,
		twitter: data.gsx$twitter.$t,
		sharetext: data.gsx$sharetext.$t,
		subdomain: data.gsx$subdomain.$t,
		state: data.gsx$state.$t,
		tweetLink: null
	};
	ret["site"] = getPoliticianSubdomain(ret);
	if (ret.twitter) {
		ret["tweetLink"] = getPoliticianTweetLink(ret);
	}
	return ret as Politician;
}

interface Politician {
	idx: number
	frontpage: boolean
	first: string
	name: string
	organization: string
	image: string
	image2x: string
	weight: string
	team: string
	size: string
	meta: string
	twitter: string | null
	sharetext: string
	subdomain: string
	site: string
	state: string
	tweetLink: string | null
}

interface PoliticiansSet {
	undecided: Politician[]
	cable: Politician[]
	internet: Politician[]
}

var teamMapper: any = {
	"undecided": "undecided",
	"team-cable": "cable",
	"team-internet": "internet"
}


function getGeocode(): Promise<string> {
	return ajaxPromise({
		url: "https://fftf-geocoder.herokuapp.com",
		method: "get",
		json: true
	}).then(function(response: Response) {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error("Bad response");
		}
	}).then(function(j: any) {
		if (
			j.country.iso_code === 'US' &&
			j.subdivisions &&
			j.subdivisions[0] &&
			j.subdivisions[0].names &&
			j.subdivisions[0].names.en
		) {
			return j.subdivisions[0].names.en;
		}
		throw new Error("no state in geocode");
	});
}

function getPoliticians(): Promise<PoliticiansSet> {
	return ajaxPromise({
		url: "https://spreadsheets.google.com/feeds/list/1n6ZuVMbfBdu3MvYutScnnD8k8B2IzqX9woBY-2PLlIM/default/public/values?alt=json",
		method: "get",
		json: true
	}).then(function(response: Response) {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error("Bad response");
		}
	}).then(function(j: any) {
		var ret: PoliticiansSet = {
			"undecided": [],
			"cable": [],
			"internet": []
		};
		_.each(j.feed.entry as any[], function(p, idx) {
			var politician = parsePolitician(p, idx);
			var team = teamMapper[politician.team];
			if (team) {
				(ret as any)[team].push(politician);
			}
		});
		return ret;
	});
}

interface Props {
	eventEmitter: EventEmitter
}

interface State {
	politiciansSet: PoliticiansSet | null
	state: string
	error: string | null
}


export class PoliticalScoreboard extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		var flags = new ExternalFlags();
		var state = flags.get("state", "");
		if (!state || !_.includes(r.states, state)) {
			state = "";
		}
		this.state = {
			politiciansSet: null,
			state: state,
			error: null
		};
	}
	componentDidMount() {
		getPoliticians().then((politiciansSet:PoliticiansSet)=> {
			this.setState({
				politiciansSet: politiciansSet
			} as State);
		});
		if (this.state.state === "") {
			getGeocode().then((state:string) => {
				if (this.state.state === "") {
					this.setState({
						state: state
					} as State);
				}
			}).catch((e) => {
				console.log(e);
			});
		}
	}
	renderPolitician(politician:Politician) {
		var isLong = (politician.name.indexOf(" ") === -1 && politician.name.length > 11);
		var hideSite = true;
		return (
			<div key={"p-" + politician.idx} className="politician">
				<img src={ politician.image } srcSet={ politician.image2x + " 2x" } />
				<div className={classes("cover", isLong && "cover-long")}>
					<span>{politician.name}</span>
				</div>
				<div className={classes("actions", hideSite && "no-site")}>
					{ politician.twitter ? <a className="btn tweet" href={politician.tweetLink as string} target="_blank">Tweet</a> : null }
					<a className="btn site" href={politician.site} target="_blank">Visit Site</a>
				</div>
			</div>
		);
	}
	renderStateOption(state: string) {
		return <option key={state} value={state}>{state}</option>
	}
	renderContent(politiciansSet:PoliticiansSet, state: string) {
		var filterState = function(set:Politician[], state:string): Politician[] {
			if (state === "") {
				return set;
			}
			return _.filter(set, (p) => {
				return p.state === state;
			});
		};
		var undecided = filterState(politiciansSet.undecided, state);
		var cable = filterState(politiciansSet.cable, state);
		var internet = filterState(politiciansSet.internet, state);
		var renderItem = this.renderPolitician.bind(this);
		return (
			<div>
				<div className="state-selector unit">
					Choose your state:
					<select name="state" value={state} onChange={handleInputChange.bind(this)}>
						<option key="null" value="">Select state</option>
						{_.map(r.states, this.renderStateOption)}
					</select>
				</div>

				{ undecided.length ?
					<div className="psb-section psb-unknown">
						<div className="unit">
							<h4>Unknown:</h4>
							<p>They haven't come out against Pai's plan yet. We need you to tweet them.</p>
						</div>
						<Carousel items={undecided} width={100} height={122} padding={10} pagePadding={30} eventEmitter={this.props.eventEmitter} renderItem={renderItem} />
					</div> : null }

				{ cable.length ?
					<div className="psb-section psb-cable">
						<div className="unit">
							<h4>Team Cable:</h4>
							<p>They are for Pai's plan. We need you to tweet them.</p>
						</div>
						<Carousel items={cable} width={100} height={122} padding={10} pagePadding={30} eventEmitter={this.props.eventEmitter} renderItem={renderItem} />
					</div> : null }

				{ internet.length ?
					<div className="psb-section psb-internet">
						<div className="unit">
							<h4>Team Internet:</h4>
							<p>They have come out against Pai's plan. Show them your support.</p>
						</div>
						<Carousel items={internet} width={100} height={122} padding={10} pagePadding={30} eventEmitter={this.props.eventEmitter} renderItem={renderItem} />
					</div> : null }
			</div>
		);
	}
	render() {
		var content: JSX.Element|null = null;
		if (this.state.politiciansSet) {
			content = this.renderContent(this.state.politiciansSet, this.state.state);
		}
		return (
			<div className="political-scoreboard">
				{ content }
			</div>
		);
	}
}
