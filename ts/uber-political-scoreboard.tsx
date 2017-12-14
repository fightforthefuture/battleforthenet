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
		getPoliticians(this.props.highlight).then((politiciansSet:PoliticiansSet)=> {
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
			<div key={"p-" + politician.idx} className="politician carousel-item-active">
				<img src={ politician.image } srcSet={ politician.image2x + " 2x" } />
				<div className={classes("cover", isLong && "cover-long")}>
					<span className="cover-name">{politician.name}</span>
					<span className="cover-org">{politician.org} - {politician.stateCode} ({politician.partyCode.toUpperCase()})</span>
				</div>
				<div className={classes("actions", hideSite && "no-site")}>
					{ politician.twitter ? <a className="btn tweet" href={politician.tweetLink as string} target="_blank">Tweet</a> : null }
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
		var congressNotForInState: Politician[] = [];
		var congressNotForOutState: Politician[] = [];
		var notFor = _.concat(politiciansSet.undecided, politiciansSet.cable);

		var sortFunction = function(p: Politician): string {
			var partySort:string;
			var orgSort:string;

			partySort = (p.partyCode === "r") ? "a" : "b";
			orgSort = (p.organization === "Senate") ? "a": "b";

			return partySort + orgSort;
		}
		var sortedNotFor = _.orderBy(notFor, sortFunction);

		_.each(sortedNotFor, function(p) {
			if (p.state === state) {
				congressNotForInState.push(p);
			} else {
				congressNotForOutState.push(p);
			}
		});

		var renderItem = this.renderPolitician.bind(this);
		return (
			<div>
				<div className="politicians-inline politicians-highlight">
					<h2>Here are the 5 Republican lawmakers who have publicly opposed the FCC's plan, but need to do more to stop the vote.</h2>
					<div className="psb-unknown">
						{_.map(politiciansSet.extracted, renderItem)}
					</div>
				</div>

				<div className="politicians-inline">
					<h2>And here are the members of Congress who have not yet opposed the FCC's plan.</h2>
					<div className="state-selector">
						<h3>Members from your state: 
						<select name="state" value={state} onChange={handleInputChange.bind(this)}>
							<option key="null" value="">Select state</option>
							{_.map(r.states, this.renderStateOption)}
						</select>
						</h3>
					</div>
					<div className="psb-unknown">
						{_.map(congressNotForInState, renderItem)}
					</div>

					<h3>Other Members of Congress</h3>
					<div className="psb-unknown">
						{_.map(congressNotForOutState, renderItem)}
					</div>
				</div>

				<div className="politicians-inline">
					<h2>Members of Congress opposed to the FCC's plan.</h2>
					<div className="psb-internet">
						{_.map(politiciansSet.internet, renderItem)}
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
