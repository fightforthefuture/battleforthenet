import * as React from 'react';
import * as _ from 'lodash';

import {CallActionFormProps, CallActionFormState, CallActionFormContext} from './call-action-form';
import {PetitionFormProps, PetitionFormState, PetitionFormContext} from './petition-form';
import {LeaderboardProps, LeaderboardState, LeaderboardContext, LeaderboardReferrer} from './leaderboard';
import {CallSuccessProps} from './call-success';
import {Disclaimer} from './disclaimer';
import {AfterActionFooter} from './after-action-footer';
import {classes, sanitizeUrl} from './utils';
import {Fragment} from './fragment';


export function PetitionFormTemplate(props:PetitionFormProps, state:PetitionFormState, ctx:PetitionFormContext) {
	return (
		<div>
			<Fragment fragmentId="bftn_email_form_header" />
			<div className="unit">
				<form className="bftn-form petition-form" onSubmit={ctx.onSubmit}>
					<img className="arrow" src="/images/red-arrow.png" />
					<div className="form-wrapper">
						<div>
							<input name="input_name" placeholder="Name" autoComplete="name" required value={state.input_name} onChange={ctx.handleInputChange} />
						</div>
						<div>
							<input name="input_email" placeholder="E-mail" required value={state.input_email} onChange={ctx.handleInputChange} />
						</div>
						<div className="address-line">
							<input name="input_address" className="address" placeholder="Address" required value={state.input_address} onChange={ctx.handleInputChange} />
							{" "}
							<input name="input_zip" className="zip" placeholder="Zip" required value={state.input_zip} onChange={ctx.handleInputChange} />
						</div>
						{props.swap ? "" : <div><input name="input_phone" className="phone" placeholder="Phone # (for text list)" value={state.input_phone} onChange={ctx.handleInputChange} /> </div> }
						<div className="letter">
							<textarea ref={ctx.setTextarea} name="input_comment" required value={state.input_comment} onChange={ctx.handleInputChange} onFocus={ctx.onTextareaFocus} ></textarea>
							<button onClick={ctx.onResetClick} className="reset">Clear and write your own</button>
						</div>
						<button className="btn">Write Congress</button>
					</div>
					{ state.error ? (
							<div className="form-error">
								<span className="oi" data-glyph="warning" title="previous" aria-hidden="true"></span>
								{" "}{state.error}
							</div>
						) : null }
					<Disclaimer org={props.org} swap={props.swap}/>
				</form>
				<Fragment fragmentId="bftn_email_body" />
			</div>
		</div>
	);
}

export function CallActionFormTemplate(props:CallActionFormProps, state:CallActionFormState, ctx:CallActionFormContext) {
	return (
		<div>
			<form className="bftn-form call-action-form" ref={ctx.bindRef} onSubmit={ctx.onSubmit}>
				{ props.isModal ? 
					<h3>Thanks! Now can you call them?</h3> :
					<h3>This is your last chance to stop ISPs from messing up your Internet.</h3>
				}
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
					(We’ll connect you and provide a suggested script of what to say. { state.campaignSpec.disclaimer }{" "}<a href="/privacy" target="_blank">Privacy Policy</a>)
				</p>
			</form>
		</div>
	);
};


export function CallSuccessTemplate(props:CallSuccessProps) {
	const content_msg = `
	I support "Title Two" net neutrality rules and I would like you to publicly oppose the FCC's
	plan to repeal them. Please contact the FCC Chairman and demand that he abandon his current plan. 
	We don't need legislation, we need you to stop the FCC from gutting the existing rules.
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
	let href = referrer.code

	if (!referrer.code.match(/^http/)) {
		href = `http://${href}`
	}

	return (
		<li key={referrer.code} >
			<a href={ sanitizeUrl(href) }>{ referrer.code }</a> ({ referrer.n.toLocaleString() })
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
