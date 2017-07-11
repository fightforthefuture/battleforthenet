import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTransitionGroup from 'react-transition-group';
import * as _ from 'lodash';

import {LoaderLogo} from './loader-logo';
import {Modal} from './modal';
import {handleInputChange} from './utils';
import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {CallSuccess} from './call-success';
import {CallActionCopy} from './call-action-copy';
import {CallActionForm} from './call-action-form';
import {PetitionCopy} from './petition-copy';
import {PetitionForm} from './petition-form';
import {r} from './r';
import {Organization} from './organization';
import {ExternalFlags} from './external-flags';

interface Props {
	initialForm: string
	org: Organization
	actionUrl: string
	campaignId: string
	deadline: Date
	swap: boolean | false
}


interface State {
	modal: string | null
}


export class BFTNFormFlow extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			modal: null,
		};
	}
	setModal(modal: string | null): any {
		this.setState({modal: modal} as State);
	}
	render() {
		var params = new ExternalFlags();
		var etsy = params.get("utm_source", "unknown") == "etsy";

		var onClose = () => {this.setModal(null)};
		var modal: JSX.Element | null = null;
		var copy: JSX.Element;
		var form: JSX.Element;
		switch (this.props.initialForm) {
			case "call":
				form = <CallActionForm header="Call to defend net neutrality!" campaignId={this.props.campaignId} setModal={this.setModal.bind(this)} isModal={false} />
				copy = <CallActionCopy />
				break;
			case "petition":
			default:
				form = <PetitionForm org={this.props.org} url={this.props.actionUrl} swap={this.props.swap} setModal={this.setModal.bind(this)} etsy={etsy} />;
				copy = <PetitionCopy deadline={this.props.deadline} etsy={etsy} />
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
						<CallActionForm header="Thanks for emailing them! Now, can you call?" campaignId={this.props.campaignId} setModal={this.setModal.bind(this)} isModal={true} />
					</Modal>
				);
				break;
			case "success":
				modal = (
					<Modal modalClass="callsuccess-modal" onClose={onClose}>
						<CallSuccess setModal={this.setModal.bind(this)} />
					</Modal>
				);
				break;
		}
		var className = etsy ? "etsy-form" : "";
		className += this.props.swap ? " swap-form" : "";
		return (
			<div className={className}>
				{ copy }
				{ form }
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
