/// <reference path="../typings/index.d.ts" />

import * as React from 'react';

import {Organization} from './organization';

interface Props {
}

interface State {
  org: Organization
}

export class Disclaimer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
        this.state = {
          org: new Organization()
        }
	}
    render() {
      return (
        <span className="note"><a href="{ this.state.org.getURL() }">{ this.state.org.getName() }</a> will contact you about future campaigns. <a href="https://www.battleforthenet.com/privacy/" className="privacy-policy-link">Privacy Policy</a></span>
      );
    }
}
