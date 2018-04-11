import * as React from 'react';

import {ajaxResult, ajaxPromise} from './utils';
import {mockAjaxPromise} from './utils';
import {handleInputChange} from './utils';
import {Organization} from './organization';

import {CallActionFormTemplate} from './templates';
import {TrackProfile} from './tracking';
import {noop, trackGAEvent, trackFBEvent} from './utils';


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
	},
	"battleforthenet-2017-senate-targets": {
		"url": "https://call-congress.fightforthefuture.org/create",
		"id": "battleforthenet-2017-senate-targets",
		"disclaimer": "Your phone number will only be used to make this call."
	},
	"california": {
		"url": "https://call-congress.fightforthefuture.org/create",
		"id": "California-SB-822",
		"disclaimer": "Your phone number will only be used to make this call."
	}
};


export interface CallActionFormProps {
	org: Organization
	campaignId: string
	isModal: boolean
	swap: boolean | false
	zip: string | ""
	setModal: (modal: string | null, zip?: string | "")=>any
	phone: string | ""
	trackProfile: TrackProfile
}


export interface CallActionFormState {
	input_phone: string | string[] | undefined
	error: boolean
	campaignSpec: CampaignSpec
}


export interface CallActionFormContext {
	bindRef: any
	onSubmit: any
	onChange: any
}


export class CallActionForm extends React.Component<CallActionFormProps, CallActionFormState> {
	formElement: HTMLElement | null
	constructor(props: CallActionFormProps) {
		super(props);
		this.state = {
			input_phone: props.phone || "",
			error: false,
			campaignSpec: campaigns[props.campaignId] || campaigns["fftf"]
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
		noop(evt);
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
			var campaign = this.state.campaignSpec;
			var data = {
				"campaignId": campaign.id,
				"userPhone": phone,
				"zipcode": this.props.zip ? this.props.zip : ""
			};
			var url = campaign.url;
			if (this.props.trackProfile.referralCode) {
				url = url + "?ref=" + this.props.trackProfile.referralCode;
			}
			submitForm(url, data)
				.then((result) => {
					this.props.setModal("success");

					// Track conversions, user data is sha256 hashed locally
					// before being transmitted to Facebook
					var fbqData: any = {};

					fbqData.ph = '1' + phone;
					if (this.props.zip) {
						fbqData.zp = this.props.zip;
					}
					fbqData.ask = this.props.trackProfile.ask;
					trackFBEvent("InitiateCall", fbqData);
					trackFBEvent("ActionTaken", fbqData);
					switch (this.props.trackProfile.ask) {
						case "callOnly":
							trackFBEvent("Call", fbqData);
							break;
						case "emailThenCall":
							trackFBEvent("CallAfterEmail", fbqData);
							break;
					}
					trackGAEvent("form", "submit", "initiated_call");
					trackGAEvent("call", "initiated", this.props.trackProfile.ask);
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
		var ctx = {
			bindRef: (form:HTMLElement) => {this.formElement = form; },
			onSubmit: this.onSubmit.bind(this),
			onChange: handleInputChange.bind(this)
		};
		return CallActionFormTemplate(this.props, this.state, ctx);
	}
}
