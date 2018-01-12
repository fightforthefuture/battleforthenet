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
	function ex(k:string): any {
		var r = data["gsx$" + k];
		if (r) {
			return r["$t"];
		} else {
			console.log("no key", k);
		}
		return null;
	}
	var imageBaseURL = 'https://www.fightforthefuture.org/congress-images/';
	var biocode = ex("bioguide");
	var team = ex("team");
	switch (team) {
		case "team-cable":
		case "team-internet":
			break;
		default:
			team = "undecided";
			break;
	}
	var ret:any = {
		idx: idx,
		biocode: biocode,
		frontpage: (ex("frontpage") === '1'),
		first: ex("first"),
		name: ex("name"),
		org: null,
		organization: ex("organization"),
		image: imageBaseURL + biocode + '_x1.jpg',
		image2x: imageBaseURL + biocode + '_x2.jpg',
		partyCode: PARTY_MAP[biocode] || "",
		weight: ex("weight"),
		team: team,
		size: ex("size"),
		meta: ex("meta"),
		twitter: ex("twitter"),
		sharetext: ex("sharetext"),
		subdomain: ex("subdomain"),
		state: ex("state"),
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
		url: "https://data.battleforthenet.com/politicians-full.json",
		// url: "/js/politicians.json",
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

function getCRAPoliticians(): Promise<any[]> {
	return ajaxPromise({
		url: "https://data.battleforthenet.com/politicians.json",
		method: "get",
		json: true
	}).then(function(response: Response) {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error("Bad response");
		}
	});
}

interface Props {
	eventEmitter: EventEmitter
}

interface State {
	politiciansSet: PoliticiansSet | null
	state: string
	error: string | null
	politicians: any[]
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
			error: null,
			politicians: []
		};
	}
	componentDidMount() {
		// getPoliticians().then((politiciansSet:PoliticiansSet)=> {
		// 	this.setState({
		// 		politiciansSet: politiciansSet
		// 	} as State);
		// });

		getCRAPoliticians().then(politicians => {
			this.setState({
				politicians: politicians
			} as State);
		})

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

	renderCRAPolitician(politician:any) {
		const isLong = (politician.name.indexOf(" ") === -1 && politician.name.length > 11)

		function imageURL(biocode:string, suffix='_x1') {
			return 'https://www.fightforthefuture.org/congress-images/' +  biocode + suffix + '.jpg';
		}

		function tweetURL(pol:any) {
			var tweetText;

			if (pol.yesOnCRA) {
				tweetText = 'I am delighted that @' + pol.twitter + ' will be voting for the CRA to overrule the FCC and save our #NetNeutrality rules. Find out where your representatives stand and ask them to do the same! https://battleforthenet.com';
			}
			else {
				tweetText = '@' + pol.twitter + ', why haven\'t you promised to vote for the CRA to overrule the FCC and save our #NetNeutrality rules? This issue matters to me! (Friends: find out where your representatives stand and contact them at https://battleforthenet.com)'
			}

			return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
		}

		return (
			<div key={"p-" + politician.biocode} className={classes("politician", politician.yesOnCRA ? 'yes-vote': '')}>
				<img src={ imageURL(politician.biocode) } srcSet={ imageURL(politician.biocode, '_x2') + " 2x" } />
				<div className={classes("cover", isLong && "cover-long")} onClick={(event: React.MouseEvent<HTMLElement>) => { 
					if (politician.twitter) {
						window.open(tweetURL(politician), '_blank')
					}
				}}>
					<span>
						{politician.name}<br/>
						<small>({politician.partyCode ? `${politician.partyCode.toUpperCase()} - ` : ''}{politician.stateCode})</small>
					</span>
				</div>
				<div className="actions no-site">
					{ politician.twitter ? <a className="btn tweet" href={tweetURL(politician)} target="_blank">Tweet</a> : null }
				</div>
			</div>
		)
	}

	renderCRAContent(politicians:any[], state: string) {
		var renderItem = this.renderCRAPolitician.bind(this);
		var items = _.sortBy(_.filter(politicians, { state: state }), ['name']);

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
							<h4>(The green ones are already voting for a CRA, so tweet at the ones who haven’t yet!)</h4>
						</div>
						<Carousel items={items} width={100} height={122} padding={10} pagePadding={30} eventEmitter={this.props.eventEmitter} renderItem={renderItem} />
					</div> : null }

			</div>
		);
	}

	render() {
		var content: JSX.Element|null = null;
		if (this.state.politicians) {
			content = this.renderCRAContent(this.state.politicians, this.state.state);
		}
		return (
			<div className="political-scoreboard">
				{ content }
			</div>
		);
	}
}
