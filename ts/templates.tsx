import * as React from 'react';
import * as _ from 'lodash';

import {CallActionFormProps, CallActionFormState, CallActionFormContext} from './call-action-form';
import {LeaderboardProps, LeaderboardState, LeaderboardContext, LeaderboardReferrer} from './leaderboard';
import {CallSuccessProps} from './call-success';
import {AfterActionFooter} from './after-action-footer';
import {classes} from './utils';


export function CallActionFormTemplate(props:CallActionFormProps, state:CallActionFormState, ctx:CallActionFormContext) {
	return (
		<div>
			<form className="bftn-form call-action-form" ref={ctx.bindRef} onSubmit={ctx.onSubmit}>
				<h3>This is your last chance to stop ISPs from messing up your Internet.</h3>
				<p>
					The FCC just announced its plan to slash net neutrality rules, allowing ISPs like Verizon to block apps, slow websites, and charge fees to control what you see & do online. They vote December 14th.
					{" "}
					<em>But if Congress gets enough calls, *they* can stop the FCC.</em>
				</p>
				<div className="flex">
					<input className={classes(state.error && "error")} name="input_phone" type="tel" placeholder="Enter your phone #" value={state.input_phone} onChange={ctx.onChange} />
					<button className="btn">
						<img src="images/phone.svg" alt="Phone" />
						<span>Call</span>
					</button>
				</div>
				<p>
					(We’ll connect you and provide a suggested script of what to say. { ctx.campaign.disclaimer }{" "}<a href="/privacy" target="_blank">Privacy Policy</a>)
				</p>
			</form>
		</div>
	);
};


export function CallSuccessTemplate(props:CallSuccessProps) {
	const content_msg = `
	I support "Title Two" net neutrality rules and I urge you to oppose the FCC's
	plan to repeal them. Specifically, I'd like you to contact the FCC Chairman and demand he abandon his current plan.
	`;
	return (
		<div>
			<h2>Calling you now!</h2>
			<p><em>Introduce yourself, be polite, and say:</em> { content_msg }</p>
			{ props.swap ? "" : <AfterActionFooter org={props.org} zip={props.zip} /> }
		</div>
	);
};


function LeaderboardReferrer(referrer:LeaderboardReferrer) {
	return (
		<li key={referrer.code} >
			{ referrer.code } ({ referrer.n.toLocaleString() })
		</li>
	);
}

export function LeaderboardTemplate(props:LeaderboardProps, state:LeaderboardState, ctx:LeaderboardContext) {
	var stats = state.leaderboardStats;
	if (stats) {
		return (
			<div>
				<div className="leaderboard-total">
					<h4><span>Total Calls</span></h4>
					<p>{ stats.completed.toLocaleString() }</p>
				</div>
				<div className="leaderboard-week">
					<h4><span>This week</span></h4>
					<p>{ stats.last_week.toLocaleString() }</p>
				</div>
				<div className="leaderboard-day">
					<h4><span>Today</span></h4>
					<p>{ stats.last_day.toLocaleString() }</p>
				</div>
				<div className={ classes("leaderboard-top", state.open && "open") }>
					<h4><span>Top Sites</span></h4>
					<ul>
						{_.map( stats.top_referrers, LeaderboardReferrer)}
					</ul>
					<div className="leaderboard-open" onClick={ctx.onOpen}>
						<span>&#x25BC; Show More</span>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div></div>
		);
	}
};
