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

import {Politician, PoliticiansSet, getGeocode, getPoliticians} from './political-scoreboard';


interface Props {
	highlight: string[]
	eventEmitter: EventEmitter
}

interface State {
	politiciansSet: PoliticiansSet | null
	state: string
	error: string | null
}


function getTweetLink(p:Politician): string {
	var shareText: string;
	var l = 280;
	var extra = " battleforthenet.com";
	if (p.sharetext) {
		shareText = p.sharetext;
	} else if (p.team === "team-cable") {
		shareText = `.@${p.twitter}, I know you've supported the destruction of the open Internet in the past. But please, #NetNeutrality matters to me. Vote for a "Congressional Resolution of Disapproval" to overrule the FCC.`;
	} else if (p.team === "team-internet") {
		shareText = `.@${p.twitter} Thank you for supporting #NetNeutrality! Now, can you vote for a "Congressional Resolution of Disapproval" to overrule the FCC?`;
	} else {
		shareText = `.@${p.twitter}, I want you to support strong Title II #NetNeutrality rules! Please vote for a "Congressional Resolution of Disapproval" to overrule the FCC!`;
	}
	if (!p.sharetext) {
		if (shareText.length < l - extra.length) {
			shareText = shareText + extra;
		}
	}
	return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&related=fightfortheftr";
}


export class UberPoliticalScoreboard extends React.Component<Props, State> {
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
		var highlight = this.props.highlight;
		getPoliticians().then((politiciansSet:PoliticiansSet)=> {
			var sortFunction = function(p: Politician): string {
				var highlightSort = (_.indexOf(highlight, p.biocode) !== -1) ? "a": "b";
				var partySort = (p.partyCode === "r") ? "a" : "b";
				var orgSort = (p.organization === "Senate") ? "a": "b";
				return highlightSort + partySort + orgSort;
			}

			var newSet = {
				internet: _.orderBy(politiciansSet.internet, sortFunction),
				undecided: _.orderBy(politiciansSet.undecided, sortFunction),
				cable: _.orderBy(politiciansSet.cable, sortFunction)
			}
			this.setState({
				politiciansSet: newSet
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
			<div key={"p-" + politician.idx} className={classes("politician", "carousel-item-active", "politician-" + politician.team)}>
				<img src={ politician.image } srcSet={ politician.image2x + " 2x" } />
				<div className={classes("cover", isLong && "cover-long")}>
					<span className="cover-name">{politician.name}</span>
					<span className="cover-org">{politician.org} - {politician.stateCode} ({politician.partyCode.toUpperCase()})</span>
				</div>
				<div className={classes("actions", hideSite && "no-site")}>
					{ politician.twitter ? <a className="btn tweet" href={getTweetLink(politician)} target="_blank">Tweet</a> : null }
					<a className="btn call" href="/?call=1">Call</a>
					<a className="btn site" href={politician.site} target="_blank">Visit Site</a>
				</div>
			</div>
		);
	}
	renderStateOption(state: string) {
		return <option key={state} value={state}>{state}</option>
	}
	renderContent(highlight: string[], politiciansSet:PoliticiansSet, state: string) {
		var congressInState: Politician[] = [];

		var congressTeamInternet = politiciansSet.internet;
		var congressUnknown = politiciansSet.undecided;
		var congressCable = politiciansSet.cable;

		_.each(congressCable, function(p) {
			if (p.state === state) {
				congressInState.push(p);
			}
		});

		_.each(congressUnknown, function(p) {
			if (p.state === state) {
				congressInState.push(p);
			}
		});

		_.each(congressTeamInternet, function(p) {
			if (p.state === state) {
				congressInState.push(p);
			}
		});

		var renderItem = this.renderPolitician.bind(this);
		return (
			<div>
				<div className="politicians-inline politicians-highlight">
					<a id="in-state" />
					<h2>Your representatives:</h2>
					<div className="state-selector">
						<p>These are your members of Congress. Start here.
							<select name="state" value={state} onChange={handleInputChange.bind(this)}>
								<option key="null" value="">Select state</option>
								{_.map(r.states, this.renderStateOption)}
							</select>
						</p>
					</div>
					<div className="psb-multi">
						{_.map(congressInState, renderItem)}
					</div>
				</div>

				<div className="politicians-inline">
					<a id="team-internet" />
					<h2>Team Internet</h2>
					<p>These are the other members of Congress who've come out against
					the FCC plan. Thank them, and ask them to vote for the CRA</p>

					<div className="psb-multi">
						{_.map(congressTeamInternet, renderItem)}
					</div>
				</div>

				<div className="politicians-inline">
					<a id="team-unknown" />
					<h2>Unknown</h2>
					<p>These are all the members of Congress whose stance we don't know
					yet. Ask them to vote for the CRA!</p>

					<div className="psb-multi">
						{_.map(congressUnknown, renderItem)}
					</div>
				</div>

				<div className="politicians-inline">
					<a id="team-cable" />
					<h2>Team Cable</h2>
					<p>These are the members of Congress who supported the FCC plan. We
					still might be able to move them</p>

					<div className="psb-multi">
						{_.map(congressCable, renderItem)}
					</div>
				</div>
			</div>
		);
	}
	render() {
		var content: JSX.Element|null = null;
		if (this.state.politiciansSet) {
			content = this.renderContent(this.props.highlight, this.state.politiciansSet, this.state.state);
		}
		return (
			<div className="political-scoreboard uber-political-scoreboard">
				{ content }
			</div>
		);
	}
}
