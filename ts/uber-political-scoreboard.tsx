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
					<span className="cover-org">{politician.org} - {politician.stateCode}</span>
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
		var notFor = _.concat(politiciansSet.undecided, politiciansSet.cable);

		var sortFunction = function(p: Politician) {
			if (p.organization === "Senate") {
				return "a";
			} else {
				return "b";
			}
		}
		var republicansNotForInState: Politician[] = [];
		var republicansNotForOutState: Politician[] = [];

		var republicansNotFor = _.orderBy(_.filter(notFor, function(p) {
			return PARTY_MAP[p.biocode] === "r";
		}), sortFunction);

		_.each(republicansNotFor, function(p) {
			if (p.state === state) {
				republicansNotForInState.push(p);
			} else {
				republicansNotForOutState.push(p);
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

				<div className="politicians-inline politicians-republicans">
					<h2>And here are the Republicans who have not yet opposed the FCC's plan.</h2>
					<div className="state-selector">
						<h3>Republicans from your state: 
						<select name="state" value={state} onChange={handleInputChange.bind(this)}>
							<option key="null" value="">Select state</option>
							{_.map(r.states, this.renderStateOption)}
						</select>
						</h3>
					</div>
					<div className="psb-unknown">
						{_.map(republicansNotForInState, renderItem)}
					</div>

					<h3>Other republicans</h3>
					<div className="psb-unknown">
						{_.map(republicansNotForOutState, renderItem)}
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
