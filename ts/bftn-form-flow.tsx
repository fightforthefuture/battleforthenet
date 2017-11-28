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
import {PetitionForm} from './petition-form';
import {r} from './r';
import {Organization} from './organization';
import {ExternalFlags} from './external-flags';
import {createTrackProfile, TrackProfile} from './tracking';

export interface BFTNFormFlowProps {
	initialForm: string
	org: Organization
	actionUrl: string
	campaignId: string
	referralCode: string | null
	deadline: Date
	swap: boolean | false
}


export interface BFTNFormFlowState {
	modal: string | null
	phone: string | ""
	zip: string | ""
	trackProfile: TrackProfile
}


export class BFTNFormFlow extends React.Component<BFTNFormFlowProps, BFTNFormFlowState> {
	constructor(props: BFTNFormFlowProps) {
		super(props);
		var params = new ExternalFlags();
		var trackProfile = createTrackProfile(props, params);
		this.state = {
			modal: null,
			phone: "",
			zip: "",
			trackProfile: trackProfile
		};
	}
	setModal(modal: string | null, zip = "", phone = ""): any {
		this.setState({modal: modal, zip: zip, phone: phone} as BFTNFormFlowState);
	}
	render() {
		var onClose = () => {this.setModal(null)};
		var modal: JSX.Element | null = null;
		var form: JSX.Element;
		switch (this.props.initialForm) {
			case "call":
				form = <CallActionForm org={this.props.org} campaignId={this.props.campaignId} setModal={this.setModal.bind(this)} isModal={false} zip={this.state.zip} phone={""} swap={this.props.swap} trackProfile={this.state.trackProfile} />;
				break;
			case "petition":
			default:
				form = <PetitionForm url={this.props.actionUrl} org={this.props.org} setModal={this.setModal.bind(this)} swap={this.props.swap} trackProfile={this.state.trackProfile} />;
				break;
		}
		switch (this.state.modal) {
			case "loading":
				modal = (
					<Modal modalClass="loading-modal">
						<LoaderLogo />
					</Modal>
				);
				break;
			case "call":
				modal = (
					<Modal modalClass="callform-modal" onClose={onClose}>
						<CallActionForm org={this.props.org} campaignId={this.props.campaignId} setModal={this.setModal.bind(this)} isModal={true} zip={this.state.zip} phone={this.state.phone} swap={this.props.swap} trackProfile={this.state.trackProfile} />
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
			<div className={classes(this.state.trackProfile.etsy && "etsy-form", this.props.swap && "swap-form")}>
				{form}
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
