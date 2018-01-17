import * as React from 'react';

import {Organization} from './organization';


interface Props {
	org: Organization
	swap: boolean | false
}

interface State {
}

export class Disclaimer extends React.Component<Props, State> {
	render() {
		const orgLink = <a href={ this.props.org.url }>{ this.props.org.name }</a>;
		return (
			this.props.swap
				? <span className="note note-small">
						One or more partner groups may send you updates on this and other
						important campaigns by email. You may, of course, unsubscribe
						whenever you like.	We will contract with third-party entities to
						manage data from this campaign. Public comments to the FCC, like
						these, are searchable by the public.
					 </span>
				: <span className="note">
						<span>{orgLink} will </span>
						contact you about future campaigns. <a href="https://www.battleforthenet.com/privacy/" className="privacy-policy-link">Privacy Policy</a>
					</span>
		);
	}
}
