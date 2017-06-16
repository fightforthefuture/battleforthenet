/// <reference path="../typings/index.d.ts" />

import * as React from 'react';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {handleInputChange} from './utils';

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
	org: string
	setModal: (modal: string | null)=>any
}


interface State {
	input_name: string | string[] | undefined
	input_email: string | string[] | undefined
	input_address: string | string[] | undefined
	input_zip: string | string[] | undefined
	input_comment: string | string[] | undefined
}


export class PetitionForm extends React.Component<Props, State> {
	formElement: HTMLElement
	constructor(props: Props) {
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
			"org": this.props.org,
			"an_tags": "[\"net-neutrality\"]",
			"an_petition_id": "2ddb0663-1282-4b17-bb13-ee89cb92efc1",
			"member[first_name]": this.state.input_name,
			"member[email]": this.state.input_email,
			"member[street_address]": this.state.input_address,
			"member[postcode]": this.state.input_zip,
			"action_comment": this.state.input_comment
		};
		submitForm(this.props.url, data)
			.then((result) => {
				console.log("DONE");
				this.props.setModal("call");
			})
			.catch((result) => {
				console.log("FAIL");
				this.props.setModal(null);
			});
	}
	render() {
		return (
			<form className="bftn-form petition-form" ref={(form) => {this.formElement = form; }} onSubmit={this.onSubmit.bind(this)}>
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
