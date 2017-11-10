import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';

import {LoaderLogo} from './loader-logo';
import {Modal} from './modal';
import {handleInputChange} from './utils';
import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {classes} from './utils';
import {CallSuccess} from './call-success';
import {CallActionForm} from './call-action-form';
import {r} from './r';
import {Organization} from './organization';
import {ExternalFlags} from './external-flags';

interface Props {
	initialForm: string
	org: Organization
	actionUrl: string
	campaignId: string
	referralCode: string | null
	deadline: Date
	swap: boolean | false
}


interface State {
	modal: string | null
	zip: string | ""
}


export class BFTNFormFlow extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			modal: null,
			zip: ""
		};
	}
	setModal(modal: string | null, zip = ""): any {
		this.setState({modal: modal, zip: zip} as State);
	}
	render() {
		var params = new ExternalFlags();
		var etsy = params.get("utm_source", "unknown") == "etsy";

		var onClose = () => {this.setModal(null)};
		var modal: JSX.Element | null = null;
		switch (this.state.modal) {
			case "loading":
				modal = (
					<Modal modalClass="loading-modal">
						<LoaderLogo />
					</Modal>
				);
				break;
			case "success":
				modal = (
					<Modal modalClass="callsuccess-modal" onClose={onClose}>
						<CallSuccess org={this.props.org} setModal={this.setModal.bind(this)} swap={this.props.swap} zip={this.state.zip} />
					</Modal>
				);
				break;
		}
		return (
			<div className={classes(etsy && "etsy-form", this.props.swap && "swap-form")}>
				<CallActionForm org={this.props.org} header="Call to defend net neutrality!" campaignId={this.props.campaignId} referralCode={this.props.referralCode} setModal={this.setModal.bind(this)} isModal={false} zip={this.state.zip} swap={this.props.swap} />
				<ReactTransitionGroup.CSSTransitionGroup
					component="div"
					transitionName="fadein"
					transitionAppear={true}
					transitionAppearTimeout={500}
					transitionEnter={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{ modal }
				</ReactTransitionGroup.CSSTransitionGroup>
			</div>
		);
	}
}
