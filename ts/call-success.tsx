import * as React from 'react';
import {Organization} from './organization';
import {AfterActionFooter} from './after-action-footer';
import {CallSuccessTemplate} from './templates';

export interface CallSuccessProps {
	org: Organization
	setModal: (modal: string | null)=>any
	swap: boolean | false
	zip: string | ""
}

export interface CallSuccessState {
}

export class CallSuccess extends React.Component<CallSuccessProps, CallSuccessState> {
	render() {
		return CallSuccessTemplate(this.props);
	}
}

