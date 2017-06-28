import * as React from 'react';

import {Organization} from './organization';


interface Props {
	org: Organization
}

interface State {
}

export class Disclaimer extends React.Component<Props, State> {
	render() {
		return (
			<span className="note"><a href={ this.props.org.url }>{ this.props.org.name }</a> will contact you about future campaigns. <a href="https://www.battleforthenet.com/privacy/" className="privacy-policy-link">Privacy Policy</a></span>
		);
	}
}
