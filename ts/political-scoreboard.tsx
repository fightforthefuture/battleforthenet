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

import {PARTY_MAP} from './data-party-map';
import {STATES} from './data-state-codes';


export function getPoliticianSubdomain(p:any): string {
	var subdomain: string;
	if (p.subdomain) {
		subdomain = p.subdomain;
	} else {
		subdomain = p.first + p.name;
	}
	var host = (p.team == "team-internet") ? ".savesthe.net" : ".breaksthe.net";
	return "http://" + subdomain + host;
}

export function getPoliticianTweetLink(p:any): string {
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
	var biocode = data.gsx$bioguide.$t;
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
		biocode: biocode,
		frontpage: (data.gsx$frontpage.$t === '1'),
		first: data.gsx$first.$t,
		name: data.gsx$name.$t,
		org: null,
		organization: data.gsx$organization.$t,
		image: imageBaseURL + biocode + '_x1.jpg',
		image2x: imageBaseURL + biocode + '_x2.jpg',
		partyCode: PARTY_MAP[biocode] || "",
		weight: data.gsx$weight.$t,
		team: team,
		size: data.gsx$size.$t,
		meta: data.gsx$meta.$t,
		twitter: data.gsx$twitter.$t,
		sharetext: data.gsx$sharetext.$t,
		subdomain: data.gsx$subdomain.$t,
		state: data.gsx$state.$t,
		stateCode: null,
		tweetLink: null
	};
	switch(ret["organization"]) {
		case "Senate":
			ret["org"] = "SEN";
			break;
		case "House":
			ret["org"] = "REP";
			break;
	}
	if (ret["state"]) {
		ret["stateCode"] = STATES[ret["state"]];
	}
	ret["site"] = getPoliticianSubdomain(ret);
	if (ret.twitter) {
		ret["tweetLink"] = getPoliticianTweetLink(ret);
	}
	return ret as Politician;
}

export interface Politician {
	idx: number
	biocode: string
	frontpage: boolean
	first: string
	name: string
	organization: string
	org: string
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
	stateCode: string
	tweetLink: string | null
	partyCode: string
}

export interface PoliticiansSet {
	undecided: Politician[]
	cable: Politician[]
	internet: Politician[]
}

var teamMapper: any = {
	"undecided": "undecided",
	"team-cable": "cable",
	"team-internet": "internet"
}


export function getGeocode(): Promise<string> {
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

export function getPoliticians(): Promise<PoliticiansSet> {
	return ajaxPromise({
		// url: "https://spreadsheets.google.com/feeds/list/1n6ZuVMbfBdu3MvYutScnnD8k8B2IzqX9woBY-2PLlIM/default/public/values?alt=json",
		// url: "https://cache.battleforthenet.com/v2/politicians.json",
		url: "/js/politicians.json",
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
			"internet": [],
		};
		_.each(j.feed.entry as any[], function(p, idx) {
			var politician = parsePolitician(p, idx);
			var key = teamMapper[politician.team];
			if (key) {
				(ret as any)[key].push(politician);
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
		var renderItem = this.renderPolitician.bind(this);
		var items = _.concat(cable, undecided);
		return (
			<div>
				<div className="state-selector unit">
					Choose your state:
					<select name="state" value={state} onChange={handleInputChange.bind(this)}>
						<option key="null" value="">Select state</option>
						{_.map(r.states, this.renderStateOption)}
					</select>
					<br /><br />
					<a className="btn" href="/scoreboard">View the scoreboard</a>
				</div>

				{ items.length ?
					<div className="psb-section psb-unknown">
						<div className="unit">
							<h4>Against net neutrality or Unknown:</h4>
						</div>
						<Carousel items={items} width={100} height={122} padding={10} pagePadding={30} eventEmitter={this.props.eventEmitter} renderItem={renderItem} />
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
