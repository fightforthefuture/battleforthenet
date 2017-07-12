import * as React from 'react';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {handleInputChange} from './utils';
import {Organization} from './organization';
import {Disclaimer} from './disclaimer';
import {ExternalFlags} from './external-flags';

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

interface Props {
	url: string
	org: Organization
	swap: boolean | false
	setModal: (modal: string | null, zip?: string | "")=>any
	etsy: boolean | false
}


interface State {
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


export class PetitionForm extends React.Component<Props, State> {
	textareaInput: HTMLTextAreaElement | null;

	constructor(props: Props) {
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
		} as State);
	}

	onSubmit(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		this.props.setModal("loading");

		this.setState({
			error: null
		} as State);

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
					console.log("DONE");
					this.props.setModal("call", this.state.input_zip);
				})
				.catch((result) => {
					console.log("FAIL");
					this.setState({
						error: "There was an error submitting the form, please try again"
					} as State);
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
		const { swap, etsy, org } = this.props;
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
					{swap ? "" : <div><input name="input_phone" className="phone" placeholder="Phone # (to volunteer)" value={this.state.input_phone} onChange={handleInputChange.bind(this)} /> </div> }
					<div className="letter">
						<textarea ref={(textarea)=>{this.textareaInput=textarea;}} name="input_comment" required value={this.state.input_comment} onChange={handleInputChange.bind(this)} onFocus={this.onTextareaFocus.bind(this)} ></textarea>
						<button onClick={this.onResetClick.bind(this)} className="reset">Clear and write your own</button>
					</div>
					{ etsy
						? <div className="etsy-shop-link"><input type="text" placeholder="Etsy Shop Link" name="input_etsy_shop" value={this.state.input_etsy_shop} onChange={handleInputChange.bind(this)} /></div>
						: ""
					}
					<button className="btn">Send Letter</button>
				</div>
				{ this.state.error ? this.renderError() : null }
				{ etsy ? <span className="opt-in"><input type="checkbox" name="input_opt_in" checked={this.state.input_opt_in} onChange={handleInputChange.bind(this)} /> </span> : "" }
				<Disclaimer org={org} optIn={etsy} swap={swap}/>
			</form>
		);
	}
}
