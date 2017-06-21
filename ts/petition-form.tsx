/// <reference path="../typings/index.d.ts" />

import * as React from 'react';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {handleInputChange} from './utils';
import {Organization} from './organization';
import {Disclaimer} from './disclaimer';

import {r} from './r';

// Mock submit:
function mockSubmitForm(url: string, data: any): Promise<ajaxResult> {
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
	url: string
	org: Organization
	setModal: (modal: string | null)=>any
}


interface State {
	input_name: string | string[] | undefined
	input_email: string | string[] | undefined
	input_address: string | string[] | undefined
	input_zip: string | string[] | undefined
	input_comment: string | string[] | undefined
	error: string | null
}


export class PetitionForm extends React.Component<Props, State> {
	textareaInput: HTMLTextAreaElement;
	constructor(props: Props) {
		super(props);
		this.state = {
			input_name: "",
			input_email: "",
			input_address: "",
			input_zip: "",
			input_comment: r.defaultFormText,
			error: null
		};
	}
	onTextareaFocus(evt: Event) {
		var target = evt.target as HTMLTextAreaElement;
		target.select();
	}
	onResetClick(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		this.textareaInput.focus();
		this.setState({
			input_comment: ""
		} as State);
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
			"org": this.props.org.code,
			"an_tags": "[\"net-neutrality\"]",
			"an_petition_id": "2ddb0663-1282-4b17-bb13-ee89cb92efc1",
			"member[first_name]": this.state.input_name,
			"member[email]": this.state.input_email,
			"member[street_address]": this.state.input_address,
			"member[postcode]": this.state.input_zip,
			"action_comment": this.state.input_comment
		};
		this.setState({
			error: null
		} as State);
		submitForm(this.props.url, data)
			.then((result) => {
				console.log("DONE");
				this.props.setModal("call");
			})
			.catch((result) => {
				console.log("FAIL");
				this.setState({
					error: "There was an error submitting the form, please try again"
				} as State);
				this.props.setModal(null);
			});
	}
	renderError() {
		return (
			<div className="form-error">
				<span className="oi" data-glyph="warning" title="previous" aria-hidden="true"></span>
				{" "}{this.state.error}
			</div>
		);
	}
	render() {
		return (
			<form className="bftn-form petition-form" onSubmit={this.onSubmit.bind(this)}>
				<img className="arrow" src="/images/red-arrow.png" />
				<div className="form-wrapper">
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
					<div className="letter">
						<textarea ref={(textarea)=>{this.textareaInput=textarea;}} name="input_comment" required value={this.state.input_comment} onChange={handleInputChange.bind(this)} onFocus={this.onTextareaFocus.bind(this)} ></textarea>
						<button onClick={this.onResetClick.bind(this)} className="reset">Clear and write your own</button>
					</div>
					<button className="btn">Send Letter</button>
				</div>
				{ this.state.error ? this.renderError() : null }
				<Disclaimer org={this.props.org} />
			</form>
		);
	}
}
