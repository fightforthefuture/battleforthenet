import {ExternalFlags} from './external-flags';
import {BFTNFormFlowProps} from './bftn-form-flow';

export interface TrackProfile {
	ask: string
	initialForm: string
	referralCode: string | null
	utm_source: string
}


export function createTrackProfile(props:BFTNFormFlowProps, params:ExternalFlags): TrackProfile {
	var ask = (props.initialForm === "call") ? "callOnly" : "emailThenCall";
	var utm_source = params.get("utm_source") || "unknown";
	return {
		ask: ask,
		initialForm: props.initialForm,
		referralCode: props.referralCode,
		utm_source: utm_source
	};
}
