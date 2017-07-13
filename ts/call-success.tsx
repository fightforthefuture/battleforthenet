import * as React from 'react';
import {Organization} from './organization';
import {User} from './user';
import {AfterActionFooter} from './after-action-footer';

interface Props {
	org: Organization
	setModal: (modal: string | null)=>any
	swap: boolean | false
	userData: User
}

interface State {
}

export class CallSuccess extends React.Component<Props, State> {
	render() {
		return (
			<div>
				<h2>Calling you now!</h2>
				<h4>
					Press * after each call to start the next one.
					Hang up whenever you like, but
					<em>more calls = more impact.</em>
				</h4>

				<p><em>You can introduce yourself and say,</em></p>
				<p>I’m concerned about net neutrality. Millions of people spoke out for the strong net neutrality rules we currently have because they protect us from Internet service providers like Comcast and Verizon that want to block, throttle, and charge us extra fees to access information equally online.</p>
				<p>I support Title II net neutrality rules and I urge you to oppose the FCC’s plan to repeal them.</p>
				{ this.props.swap ? "" : <AfterActionFooter org={this.props.org} userData={this.props.userData} /> }
			</div>
		);
	}
}

