import * as React from 'react';
import {Organization} from './organization';
import {AfterActionFooter} from './after-action-footer';

interface Props {
	org: Organization
	setModal: (modal: string | null)=>any
	swap: boolean | false
	zip: string | ""
}

interface State {
}

const content_msg = `
I support Title II net neutrality rules and I urge you to oppose the FCC's
plan to repeal them. Specifically, I'd like you to oppose Ajit Pai's
confirmation as FCC Chair, and contact the FCC to demand that they abandon
their current plan.
`;

export class CallSuccess extends React.Component<Props, State> {
	render() {
		return (
			<div>
				<h2>Calling you now!</h2>

				<p><em>Introduce yourself and say,</em></p>
				<p>{ content_msg }</p>
				{ this.props.swap ? "" : <AfterActionFooter org={this.props.org} zip={this.props.zip} /> }
			</div>
		);
	}
}

