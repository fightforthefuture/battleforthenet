/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as nanoajax from 'nanoajax';
import * as _ from 'lodash';


export interface ajaxRequest {
	url: string
	method: string
	body?: string
	obj?: any
	json?: boolean
	cors?: boolean
}


export interface ajaxResult {
	code: number
	response: any
	xhr?: any
	json?: any
}


export function mockAjaxPromise(result: any, timeout: number): Promise<ajaxResult> {
	return new Promise((resolve, reject) => {
		window.setTimeout(function() {
			resolve(result);
		}, timeout);
	});
};


function encodeObject(obj: {[key: string]: any}): string {
	var pairs = _.map(obj, function(v, k) {
		return encodeURIComponent(k as string) + '=' + encodeURIComponent(v as string);
	});
	return pairs.join('&').replace(/%20/g, '+');
};


export function ajaxPromise(opts: any): Promise<ajaxResult> {
	var cors = _.isUndefined(opts.cords) ? opts.cors : true;
	var json = _.isUndefined(opts.json) ? opts.json : false;
	var body: string;
	if (opts.obj) {
		body = encodeObject(opts.obj);
	} else {
		body = opts.body;
	}
	return new Promise((resolve, reject) => {
		nanoajax.ajax({
			url: opts.url,
			body: body,
			method: opts.method,
			cors: cors
		}, function(code, response, xhr) {
			console.log(code, response);
			var result = {code, response, xhr};
			if (code === 200) {
				resolve(result);
			} else {
				reject(result);
			}
		});
	});
};


export function getScrollTop() {
	return window.scrollY || document.documentElement.scrollTop;
};


export function handleInputChange(evt: React.FormEvent) {
	const target = evt.target as HTMLInputElement;
	const val = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;
	var data:any = {};
	data[name] = val;
	this.setState(data);
};


export function mountComponent(el: React.ReactElement<any>, target: any) {
	ReactDOM.render(el, target);
};
