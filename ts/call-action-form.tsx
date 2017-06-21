/// <reference path="../typings/index.d.ts" />

import * as React from 'react';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {handleInputChange} from './utils';


// Mock submit:
function mockSubmitForm(url: string, data: any): Promise<ajaxResult> {
	console.log(data);
	return mockAjaxPromise({
		code: 200,
		response: data,
		xhr: null
	}, 2000);
}


// Production submit:
function submitForm(url: string, data: any) {
	return ajaxPromise({
		url: url,
		method: "post",
		obj: data,
		json: true
	});
}


interface Props {
	header: string
	url: string
	isModal: boolean
	setModal: (modal: string | null)=>any
}


interface State {
	input_phone: string | string[] | undefined
	error: boolean
}


export class CallActionForm extends React.Component<Props, State> {
	formElement: HTMLElement
	constructor(props: Props) {
		super(props);
		this.state = {
			input_phone: "",
			error: false
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
				error: true
			} as State);
		} else {
			this.setState({
				error: false
			} as State);
			this.props.setModal("loading");
			var data = {
				"campaignId": "battleforthenet-2017",
				"userPhone": phone
			};
			submitForm(this.props.url, data)
				.then((result) => {
					console.log("DONE");
					this.props.setModal("success");
				})
				.catch((result) => {
					console.log("FAIL");
					if (this.props.isModal) {
						this.props.setModal("call");
					}
				});
		};
	}
	render() {
		return (
			<form className="bftn-form call-action-form" ref={(form) => {this.formElement = form; }} onSubmit={this.onSubmit.bind(this)}>
				<h3>{ this.props.header }</h3>
				<p>
					Enter your number and we'll connect you to Congress and the FCC.<br />
					(We'll also give you suggestions on what to say)
				</p>
				<div>
					<input className={this.state.error? "error": ""} name="input_phone" type="tel" placeholder="555-555-5555" value={this.state.input_phone} onChange={handleInputChange.bind(this)} />
				</div>
				<div>
					<button className="btn">Call Congress</button>
				</div>
				<p className="disclaimer">Your phone number will only be used to make this call. <a href="/privacy" target="_blank">Privacy Policy</a></p>
			</form>
		);
	}
}
