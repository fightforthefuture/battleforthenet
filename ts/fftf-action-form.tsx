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
import {r} from './r';


// Mock submit:
function mockSubmitActionForm(url: string, data: any): Promise<ajaxResult> {
	return mockAjaxPromise({
		code: 200,
		response: data,
		xhr: null
	}, 2000);
}


// Production submit:
function submitActionForm(url: string, data: any): Promise<ajaxResult> {
	return ajaxPromise({
 		url: url,
		method: "post",
		obj: data,
		json: true
	});
}


interface ActionProps {
	url: string
	setModal: (modal: string | null)=>any
}


interface ActionState {
	input_name: string | string[] | undefined
	input_email: string | string[] | undefined
	input_address: string | string[] | undefined
	input_zip: string | string[] | undefined
	input_comment: string | string[] | undefined
}

class ActionForm extends React.Component<ActionProps, ActionState> {
	formElement: HTMLElement
	constructor(props: ActionProps) {
		super(props);
		this.state = {
			input_name: "",
			input_email: "",
			input_address: "",
			input_zip: "",
			input_comment: r.defaultFormText
		};
	}
	onSubmit(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		this.props.setModal("loading");
		var data = {
			"subject": "Protect Net Neutrality!",
			"member[country]": "US",
			"hp_enabled": "on",
			"guard": "",
			"contact_congress": "1",
			"fcc_ecfs_docket": "17-108",
			"org": "fftf",
			"an_tags": "[\"net-neutrality\"]",
			"an_petition_id": "2ddb0663-1282-4b17-bb13-ee89cb92efc1",
			"member[first_name]": this.state.input_name,
			"member[email]": this.state.input_email,
			"member[street_address]": this.state.input_address,
			"member[postcode]": this.state.input_zip,
			"action_comment": this.state.input_comment
		};
		submitActionForm(this.props.url, data)
			.then((result: ajaxResult) => {
				console.log("DONE");
				this.props.setModal("callform");
			})
			.catch((result: ajaxResult) => {
				console.log("FAIL");
				this.props.setModal(null);
			});
	}
	render() {
		return (
			<form id="action-form" ref={(form) => {this.formElement = form; }} onSubmit={this.onSubmit.bind(this)}>
				<img className="arrow" src="/images/red-arrow.png" />
				<div>
					<input name="input_name" placeholder="Name" autoComplete="name" required value={this.state.input_name} onChange={handleInputChange.bind(this)} />
				</div>
				<div>
					<input name="input_email" placeholder="E-mail" required value={this.state.input_email} onChange={handleInputChange.bind(this)} />
				</div>
				<div className="address-line">
					<input name="input_address" className="address" placeholder="Address" required value={this.state.input_address} onChange={handleInputChange.bind(this)} />
					{" "}
					<input name="input_zip" className="zip" placeholder="Zip" required value={this.state.input_zip} onChange={handleInputChange.bind(this)} />
				</div>
				<div>
					<textarea name="input_comment" required value={this.state.input_comment} onChange={handleInputChange.bind(this)} ></textarea>
				</div>
				<button className="btn">Send Letter</button>
				<span className="note"><em>Demand Progress</em> and <em>Fight for the Future</em> will contact you about future campaigns. <a>Privacy Policy</a></span>
			</form>
		);
	}
}


// Mock submit:
function mockSubmitCallForm(url: string, data: any): Promise<ajaxResult> {
	console.log(data);
	return mockAjaxPromise({
		code: 200,
		response: data,
		xhr: null
	}, 2000);
}


// Production submit:
function submitCallForm(url: string, data: any): Promise<ajaxResult> {
	return ajaxPromise({
		url: url,
		method: "post",
		obj: data,
		json: true
	});
}


interface CallProps {
	url: string
	setModal: (modal: string | null)=>any
}


interface CallState {
	input_phone: string | string[] | undefined
	error_phone: boolean
}


class CallForm extends React.Component<CallProps, CallState> {
	formElement: HTMLElement
	constructor(props: ActionProps) {
		super(props);
		this.state = {
			input_phone: "",
			error_phone: false
		};
	}
	validatePhoneNumber(v: any): string | false {
		var phone = v
			.replace(/\s/g, '')
			.replace(/\(/g, '')
			.replace(/\)/g, '')
			.replace(/\-/g, '');
		// Remove country code
		// TODO: Add support for non-US country codes on backend?
		phone = phone.replace('+', '');
		if (phone.charAt(0) == '1') {
			phone = phone.substr(1);
		}
		// Return formatted phone number if valid
		return phone.length == 10 ? phone : false;
	}
	onSubmit(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		var phone = this.validatePhoneNumber(this.state.input_phone);
		if (phone === false) {
			this.setState({
				error_phone: true
			} as CallState);
		} else {
			this.setState({
				error_phone: false
			} as CallState);
			this.props.setModal("loading");
			var data = {
				"campaignId": "battleforthenet-2017",
				"userPhone": phone
			};
			submitCallForm(this.props.url, data)
				.then((result: ajaxResult) => {
					console.log("DONE");
					this.props.setModal("success");
				})
				.catch((result: ajaxResult) => {
					console.log("FAIL");
					this.props.setModal("callform");
				});
		};
	}
	render() {
		return (
			<form id="call-form" ref={(form) => {this.formElement = form; }} onSubmit={this.onSubmit.bind(this)}>
				<h3>Call to defend net neutrality!</h3>
				<p>Enter your number and we'll connect you to Congress and the FCC.</p>
				<input className={this.state.error_phone ? "error": ""} name="input_phone" type="tel" placeholder="555-555-5555" value={this.state.input_phone} onChange={handleInputChange.bind(this)} />
				<button className="btn">Call Congress</button>
				<p className="disclaimer">Your phone number will only be used to make this call. <a href="/privacy" target="_blank">Privacy Policy</a></p>
			</form>
		);
	}
}


interface SuccessProps {
	setModal: (modal: string | null)=>any
}

interface SuccessState {
}

class CallSuccess extends React.Component<SuccessProps, SuccessState> {
	render() {
		return (
			<div>
				<h4>Calling you now! Press * after each call to start the next one.</h4>
				<h4>Hang up whenever you like, but more calls = more impact.</h4>
				<p><em>You can say:</em></p>
				<p>In 2015 -- after millions of us spoke out -- the Federal Communications Commission put strong net neutrality rules in place. They protect the internet and make sure that Americans can use it for speech, commerce, and other important functions.</p>
				<p>Now the FCC is trying to undo those rules and let internet service providers manipulate our data to suit their corporate interests. I oppose the FCC’s efforts to roll back Title II net neutrality rules -- and I urge you to oppose them as well.</p>
			</div>
		);
	}
}


interface FlowProps {
	actionUrl: string
	callUrl: string
}

interface FlowState {
	modal: string | null
}

export class FFTFActionFormFlow extends React.Component<FlowProps, FlowState> {
	constructor(props: FlowProps) {
		super(props);
		this.state = {
			modal: null
		};
	}
	setModal(modal: string | null): any {
		this.setState({modal: modal} as FlowState);
	}
	render() {
		var modal: JSX.Element | null = null;
		var onClose = () => {this.setModal(null)};
		switch (this.state.modal) {
			case "loading":
				modal = (
					<Modal modalClass="loading-modal">
						<LoaderLogo />
					</Modal>
				);
				break;
			case "callform":
				modal = (
					<Modal modalClass="callform-modal" onClose={onClose}>
						<CallForm url={this.props.callUrl} setModal={this.setModal.bind(this)} />
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
				<ActionForm url={this.props.actionUrl} setModal={this.setModal.bind(this)} />
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
