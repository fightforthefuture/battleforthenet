import * as React from 'react';

import {CallActionFormProps, CallActionFormState, CallActionFormContext} from './call-action-form';
import {CallSuccessProps} from './call-success';
import {AfterActionFooter} from './after-action-footer';
import {classes} from './utils';


export function CallActionFormTemplate(props:CallActionFormProps, state:CallActionFormState, ctx:CallActionFormContext) {
	return (
		<div>
			<form className="bftn-form call-action-form" ref={ctx.bindRef} onSubmit={ctx.onSubmit}>
				<h3>This may be your last chance to stop ISPs from #$%@'ing with your Internet.</h3>
				<p>
					FCC Chair Ajit Pai is about to break America's net neutrality
					rules—meaning ISPs like Comcast & Verizon will be free to block apps,
					slow websites, and charge fees to control what you see & do online.
					{" "}
					<em>This is utter garbage, but only Congressional Republicans can stop
					him, and we may have only 13 days to do it. Can you call Congress
					right now?</em>
				</p>
				<div>
					<input className={classes(state.error && "error")} name="input_phone" type="tel" placeholder="Enter your phone #" value={state.input_phone} onChange={ctx.onChange} />
				</div>
				<div>
					<button className="btn">Call Congress</button>
				</div>
				<p>
					(We’ll connect you and provide a suggested script of what to say)
				</p>
				<p className="disclaimer">{ ctx.campaign.disclaimer }{" "}<a href="/privacy" target="_blank">Privacy Policy</a></p>
			</form>
		</div>
	);
};


export function CallSuccessTemplate(props:CallSuccessProps) {
	const content_msg = `
	I support Title II net neutrality rules and I urge you to oppose the FCC's
	plan to repeal them. Specifically, I'd like you to oppose Ajit Pai's
	confirmation as FCC Chair, and contact the FCC to demand that they abandon
	their current plan.
	`;
	return (
		<div>
			<h2>Calling you now!</h2>
			<p><em>Introduce yourself and say,</em></p>
			<p>{ content_msg }</p>
			{ props.swap ? "" : <AfterActionFooter org={props.org} zip={props.zip} /> }
		</div>
	);
};
