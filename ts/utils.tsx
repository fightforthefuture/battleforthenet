/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as nanoajax from 'nanoajax';


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

export function ajaxPromise(opts: any): Promise<ajaxResult> {
	return new Promise((resolve, reject) => {
		nanoajax.ajax(opts, function(code, response, xhr) {
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
