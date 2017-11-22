import * as React from 'react';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {handleInputChange} from './utils';
import {Organization} from './organization';
import {Disclaimer} from './disclaimer';
import {ExternalFlags} from './external-flags';

import {PetitionFormTemplate} from './templates';

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

// Use JSONP to submit the form, used for submitting directly to ActionKit
function jsonpSubmit(url: string, data: any) {
	var scriptTag = document.createElement('script');
	var queryString = "";
	for (var key in data) {
		var val = data[key];
		queryString += encodeURIComponent(key).replace(/%20/g, '+') + "=" + encodeURIComponent(val).replace(/%20/g, '+') + "&";
	};
	scriptTag.src = url + '?' + queryString;
	var otherTag = document.getElementsByTagName('script')[0];
	if (otherTag != null && otherTag.parentNode != null) {
		otherTag.parentNode.insertBefore(scriptTag, otherTag);
	}
}

/**** For the callback after successful submission to ActionKit ****/
declare global {
	interface Window {
		actionKitSubmitSuccess: (response : Object) => any
	}
}

export interface PetitionFormProps {
	url: string
	org: Organization
	swap: boolean | false
	setModal: (modal: string | null, zip?: string | "")=>any
	etsy: boolean | false
}


export interface PetitionFormState {
	input_name: string | string[] | undefined
	input_email: string | string[] | undefined
	input_address: string | string[] | undefined
	input_zip: string | undefined
	input_phone: string | string[] | undefined
	input_comment: string | string[] | undefined
	input_etsy_shop: string | string[] | undefined
	input_opt_in: boolean | true
	error: string | null
}

export interface PetitionFormContext {
	handleInputChange: any
	onResetClick: any
	onSubmit: any
	onTextareaFocus: any
	setTextarea: any
}


export class PetitionForm extends React.Component<PetitionFormProps, PetitionFormState> {
	textareaInput: HTMLTextAreaElement | null;

	constructor(props: PetitionFormProps) {
		super(props);

		this.state = {
			input_name: "",
			input_email: "",
			input_address: "",
			input_zip: "",
			input_phone: "",
			input_comment: this.props.etsy ? r.etsyFormText : r.defaultFormText,
			input_etsy_shop: "",
			input_opt_in: true,
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
		if (this.textareaInput) {
			this.textareaInput.focus();
		}
		this.setState({
			input_comment: ""
		} as PetitionFormState);
	}

	onSubmit(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		this.props.setModal("loading");

		this.setState({
			error: null
		} as PetitionFormState);

		var params = new ExternalFlags();

		if (this.props.swap) {
			// Submit form directly to ActionKit

			// Define success callback and bind this
			window.actionKitSubmitSuccess = function(response : Object) {
				console.log("SUCCESS");
				this.props.setModal("call", this.state.input_zip);
			}.bind(this);

			var actionKitData = {
				"page": "battleforthenet_2017_swap",
				"js": "1", // tell actionkit to respond with JS
				"callback": "actionKitSubmitSuccess", // Tell actionkit what JS function to call after successful submit
    		"utf8": "\u1234", // Tell actionkit this is UTF8
				"name": this.state.input_name,
				"email": this.state.input_email,
				"address1": this.state.input_address,
				"zip": this.state.input_zip,
				"country": "US",
				"action_comment": this.state.input_comment,
				"opt_in": true,
				"source": params.get("utm_source", "unknown")
			};
			jsonpSubmit(this.props.url, actionKitData);
		} else {
			var data:any = {
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
				"member[phone_number]": this.state.input_phone,
				"action_comment": (this.state.input_etsy_shop ? "Etsy Shop " + this.state.input_etsy_shop + "\n\n" : "") + this.state.input_comment
			};
			if (!this.state.input_opt_in) {
			 data["opt_out"] = "1";
			}

			submitForm(this.props.url, data)
				.then((result) => {
					this.props.setModal("call", this.state.input_zip);
				})
				.catch((result) => {
					this.setState({
						error: "There was an error submitting the form, please try again"
					} as PetitionFormState);
					this.props.setModal(null);
				});
		}
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
		var ctx: PetitionFormContext = {
			handleInputChange: handleInputChange.bind(this),
			onResetClick: this.onResetClick.bind(this),
			onSubmit: this.onSubmit.bind(this),
			onTextareaFocus: this.onTextareaFocus.bind(this),
			setTextarea: (textarea:HTMLTextAreaElement) => {this.textareaInput=textarea;}
		};
		return PetitionFormTemplate(this.props, this.state, ctx);
	}
}
