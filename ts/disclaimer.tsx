import * as React from 'react';

import {Organization} from './organization';


interface Props {
  org: Organization
  optIn: boolean | false
  swap: boolean | false
}

interface State {
}

export class Disclaimer extends React.Component<Props, State> {
	render() {
		const {optIn, swap} = this.props;
    const orgLink = <a href={ this.props.org.url }>{ this.props.org.name }</a>;
    return (
      swap
        ? <span className="note note-small">
            One or more partner groups may send you updates on this and other important campaigns by email. You may, of course, unsubscribe from their email list(s) whenever you like.
            We will contract with third-party entities to manage data from this campaign. We will file formal comments with the FCC on your behalf – as such, the information you submit here will be searchable by the public.
           </span>
        : <span className="note">
            {optIn
              ? <span>Allow {orgLink} to</span>
              : <span>{orgLink} will</span>
            }
            contact you about future campaigns. <a href="https://www.battleforthenet.com/privacy/" className="privacy-policy-link">Privacy Policy</a>
          </span>
		);
	}
}
