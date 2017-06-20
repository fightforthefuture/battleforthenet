/// <reference path="../typings/index.d.ts" />

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


interface Props {
	initialForm: string
	org: string
	actionUrl: string
	callUrl: string
	deadline: Date
}


interface State {
	modal: string | null
}


export class BFTNFormFlow extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			modal: null
		};
	}
	setModal(modal: string | null): any {
		this.setState({modal: modal} as State);
	}
	render() {
		var onClose = () => {this.setModal(null)};
		var modal: JSX.Element | null = null;
		var copy: JSX.Element;
		var form: JSX.Element;
		switch (this.props.initialForm) {
			case "call":
				form = <CallActionForm url={this.props.callUrl} setModal={this.setModal.bind(this)} isModal={false} />
				copy = <CallActionCopy />
				break;
			case "petition":
			default:
				form = <PetitionForm org={this.props.org} url={this.props.actionUrl} setModal={this.setModal.bind(this)} />;
				copy = <PetitionCopy deadline={this.props.deadline} />
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
						<CallActionForm url={this.props.callUrl} setModal={this.setModal.bind(this)} isModal={true} />
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
		return (
			<div>
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
