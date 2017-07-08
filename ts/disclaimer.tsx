import * as React from 'react';

import {Organization} from './organization';


interface Props {
  org: Organization
  optIn: boolean | false
}

interface State {
}

export class Disclaimer extends React.Component<Props, State> {
	render() {
		const optIn = this.props.optIn;
    const orgLink = <a href={ this.props.org.url }>{ this.props.org.name }</a>;
    return (
      <span className="note">
        {optIn ? <span>Allow {orgLink} to</span> : <span>{orgLink} will</span>} contact you about future campaigns. <a href="https://www.battleforthenet.com/privacy/" className="privacy-policy-link">Privacy Policy</a>
      </span>
		);
	}
}
