/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTransitionGroup from 'react-transition-group';
import * as $ from 'jquery';
import * as _ from 'lodash';

import {LoaderLogo} from './loader-logo';
import {r} from './r';


// Mock submit:
import {MockDeferred} from './mock-jq-deferred';
function mockSubmitForm(actionForm: HTMLElement) {
	var data = $(actionForm).serialize();
	console.log(data);

	// success case:
	return new MockDeferred({data: {}}, true, 2000);

	// error case:
	// return new MockDeferred({oops: true}, false, 2000);
}


// Production submit:
function submitForm(actionForm: HTMLElement) {
	var data = $(actionForm).serialize();
	return $.ajax({
 		url: "https://queue.fightforthefuture.org/action",
		method: "post",
		data: data
	});
}

interface EmptyProps {
}

interface EmptyState {
}


interface ActionProps {
	openLoader: ()=>any
	closeLoader: ()=>any
	openCallForm: ()=>any
}

class ActionForm extends React.Component<ActionProps, EmptyState> {
	formElement: HTMLElement
	onSubmit(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		this.props.openLoader();
		mockSubmitForm(this.formElement)
			.done((data: any, status: string, xhr: JQueryXHR) => {
				console.log("DONE");
				this.props.openCallForm();
			})
			.fail((xhr: JQueryXHR, status: string, err: Error) => {
				console.log("FAIL");
			})
			.always(() => {
				this.props.closeLoader();
			});
	}
	render() {
		return (
			<form id="action-form" ref={(form) => {this.formElement = form; }} onSubmit={this.onSubmit.bind(this)}>
				<input type="hidden" name="subject" value="Protect Net Neutrality!" />
				<input className="hidden" type="hidden" name="member[country]" value="US" />
				<input className="hidden" type="checkbox" name="hp_enabled" checked readOnly />
				<input className="hidden" type="checkbox" name="hp_disabled" />
				<input className="hidden" type="text" name="guard" />
				<input type="hidden" name="contact_congress" value="1" />
				<input type="hidden" name="fcc_ecfs_docket" value="17-108" />
				<input type="hidden" name="org" value="fftf" />
				<input type="hidden" name="an_tags" value={"[\"net-neutrality\"]"} />
				<input type="hidden" name="an_petition_id" value="2ddb0663-1282-4b17-bb13-ee89cb92efc1" />
				<img className="arrow" src="/images/red-arrow.png" />
				<div>
					<input name="member[first_name]" placeholder="Name" autoComplete="name" required defaultValue="" />
				</div>
				<div>
					<input name="member[email]" placeholder="E-mail" required defaultValue="" />
				</div>
				<div className="address-line">
					<input name="member[street_address]" className="address" placeholder="Address" required defaultValue="" />
					{" "}
					<input name="member[postcode]" className="zip" placeholder="Zip" required defaultValue="" />
				</div>
				<div>
					<textarea name="action_comment" required defaultValue={r.defaultFormText}></textarea>
				</div>
				<button className="btn">Send Letter</button>
				<span className="note"><em>Demand Progress</em> and <em>Fight for the Future</em> will contact you about future campaigns. <a>Privacy Policy</a></span>
			</form>
		);
	}
}

class CallForm extends React.Component<EmptyProps, EmptyState> {
	render() {
		return (
			<form id="call-form">
				<h3>Call to defend net neutrality!</h3>
				<p>Enter your number and we'll connect you to Congress and the FCC.</p>
				<input type="tel" id="userPhone" placeholder="555-555-5555" />
				<button className="btn">Call Congress</button>
				<p className="disclaimer">Your phone number will only be used to make this call. <a href="/privacy" target="_blank">Privacy Policy</a></p>
			</form>
		);
	}
}

interface FlowState {
	callForm: boolean
	loading: boolean
}

export class FFTFActionFormFlow extends React.Component<EmptyProps, FlowState> {
	constructor(props: EmptyProps) {
		super(props);
		this.state = {
			callForm: false,
			loading: false
		};
	}
	updateState(newState: any): void {
		this.setState((prevState) => {
			return _.defaults(newState, prevState) as FlowState;
		});
	}
	openLoader(): void {
		this.updateState({loading: true});
	}
	closeLoader(): void {
		this.updateState({loading: false});
	}
	openCallForm(): void {
		this.updateState({callForm: true});
	}
	closeCallForm(): void {
		this.updateState({callForm: false});
	}
	renderLoader(): JSX.Element {
		return (
			<div className="modal loading-modal">
				<div className="modal-background"></div>
				<div className="modal-content-container">
					<div className="modal-content">
						<LoaderLogo />
					</div>
				</div>
			</div>
		);
	}
	renderCallForm(): JSX.Element {
		return (
			<div className="modal callform-modal">
				<div className="modal-background"></div>
				<div className="modal-close" onClick={this.closeCallForm.bind(this)}>
					<span className="oi" data-glyph="circle-x" title="close" aria-hidden="true"></span>
				</div>
				<div className="modal-content-container">
					<div className="modal-content">
						<CallForm />
					</div>
				</div>
			</div>
		);
	}
	render() {
		return (
			<div>
				<ActionForm openLoader={this.openLoader.bind(this)} closeLoader={this.closeLoader.bind(this)} openCallForm={this.openCallForm.bind(this)} />
				<ReactTransitionGroup.CSSTransitionGroup
					component="div"
					transitionName="fadein"
					transitionAppear={true}
					transitionAppearTimeout={500}
					transitionEnter={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{ this.state.loading ? this.renderLoader() : null }
				</ReactTransitionGroup.CSSTransitionGroup>
				<ReactTransitionGroup.CSSTransitionGroup
					component="div"
					transitionName="fadein"
					transitionAppear={true}
					transitionAppearTimeout={500}
					transitionEnter={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{ this.state.callForm ? this.renderCallForm() : null }
				</ReactTransitionGroup.CSSTransitionGroup>
			</div>
		);
	}
}
