import * as React from 'react';

import {CallActionFormProps, CallActionFormState, CallActionFormContext} from './call-action-form';
import {CallSuccessProps} from './call-success';
import {AfterActionFooter} from './after-action-footer';
import {classes} from './utils';


export function CallActionFormTemplate(props:CallActionFormProps, state:CallActionFormState, ctx:CallActionFormContext) {
	return (
		<div>
			<form className="bftn-form call-action-form" ref={ctx.bindRef} onSubmit={ctx.onSubmit}>
				<h3>This may be your last chance to stop ISPs from messing with your Internet.</h3>
				<p>
					FCC Chair Ajit Pai is about to break America's net neutrality
					rules—meaning companies like Comcast & Verizon will be able to block apps,
					slow websites, and charge fees to control what you see & do online.
					{" "}
					<em>This is utter garbage, but only Congress can stop
					him now, and we may have only 13 days. Can you call Congress
					right now?</em>
				</p>
				<div className="flex">
					<input className={classes(state.error && "error")} name="input_phone" type="tel" placeholder="Enter your phone #" value={state.input_phone} onChange={ctx.onChange} />
					<button className="btn">
                      <img src="images/phone.svg" alt="Phone" />
                      <span>Call</span>
                    </button>
				</div>
				<p>
					(We’ll connect you and provide a suggested script of what to say. { ctx.campaign.disclaimer }{" "}<a href="/privacy" target="_blank">Privacy Policy</a>)</p>
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
