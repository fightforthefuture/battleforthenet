import * as React from 'react';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {handleInputChange} from './utils';
import {Organization} from './organization';

import {CallActionFormTemplate} from './templates';

// Mock submit:
function mockSubmitForm(url: string, data: any): Promise<ajaxResult> {
	console.log(url, data);
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


interface CampaignSpec {
	url: string
	id: string
	disclaimer: string
}
type Campaigns = {[key:string]: CampaignSpec};


const campaigns:Campaigns = {
	"daily": {
		"url": "https://demandprogress.callpower.org/call/create",
		"id": "1",
		"disclaimer": "Your phone number will only be used for Battle for the Net to connect you with Congress and the FCC."
	},
	"fftf": {
		"url": "https://call-congress.fightforthefuture.org/create",
		"id": "battleforthenet-2017",
		"disclaimer": "Your phone number will only be used to make this call."
	}
};


export interface CallActionFormProps {
	org: Organization
	header: string
	campaignId: string
	isModal: boolean
	swap: boolean | false
	zip: string | ""
	setModal: (modal: string | null, zip?: string | "")=>any
}


export interface CallActionFormState {
	input_phone: string | string[] | undefined
	error: boolean
}


export interface CallActionFormContext {
	bindRef: any
	onSubmit: any
	onChange: any
	campaign: CampaignSpec
}


export class CallActionForm extends React.Component<CallActionFormProps, CallActionFormState> {
	formElement: HTMLElement | null
	constructor(props: CallActionFormProps) {
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
	getCampaign(campaignId: string): CampaignSpec {
		return campaigns[campaignId] || campaigns["fftf"];
	}
	onSubmit(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		var phone = this.validatePhoneNumber(this.state.input_phone);
		if (phone === false) {
			this.setState({
				error: true
			} as CallActionFormState);
		} else {
			this.setState({
				error: false
			} as CallActionFormState);
			this.props.setModal("loading");
			var campaign = this.getCampaign(this.props.campaignId);
			var data = {
				"campaignId": campaign.id,
				"userPhone": phone,
				"zipcode": this.props.zip ? this.props.zip : ""
			};
			submitForm(campaign.url, data)
				.then((result) => {
					console.log("DONE");
					this.props.setModal("success");
				})
				.catch((result) => {
					console.log("FAIL");
					if (this.props.isModal) {
						this.props.setModal("call", this.props.zip);
					}
				});
		};
	}
	render() {
		var campaign = this.getCampaign(this.props.campaignId);

		var ctx = {
			bindRef: (form:HTMLElement) => {this.formElement = form; },
			onSubmit: this.onSubmit.bind(this),
			onChange: handleInputChange.bind(this),
			campaign: campaign
		};
		return CallActionFormTemplate(this.props, this.state, ctx);
	}
}
