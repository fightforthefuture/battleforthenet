import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';


// To use ga
declare var ga: any;


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


export function ajaxPromise(opts: any)  {
	var cors = !_.isUndefined(opts.cors) ? opts.cors : true;
	var json = !_.isUndefined(opts.json) ? opts.json : false;
	var spec: any = {
		url: opts.url,
		method: opts.method.toUpperCase()
	};
	if (cors) {
		spec['mode'] = 'cors';
	}
	if (opts.obj) {
		spec['body'] = encodeObject(opts.obj);
		spec['headers'] = {
			'Content-Type': 'application/x-www-form-urlencoded'
		};
	} else {
		spec['body'] = opts.body;
	}
	return fetch(
		opts.url, spec
	).then(function(response) {
		return response;
	});
};


export function getScrollTop() {
	return window.scrollY || document.documentElement.scrollTop;
};


export function handleInputChange(evt: React.FormEvent<any>) {
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


export function clamp(v: number, l: number): number {
	while (v < 0) {
		v = v + l;
	}
	return v % l;
};


export function classes(...c: (string|boolean|null)[]): string {
	return _.filter(c).join(" ");
};


function normalizeToDay(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}


export function daysUntil(d: Date): number {
	const delta = (normalizeToDay(d).valueOf() - normalizeToDay(new Date()).valueOf());
	return Math.floor(delta / 864e5);
};


export function noop(evt:Event): void {
	evt.preventDefault();
};


export function trackEvent(s: String): void {
	if (ga) {
		ga("send", "event", "form", "submit", s);
	}
}

export function sanitizeUrl(url: String): string {
	var invalidPrototcolRegex = /^(%20|\s)*(javascript|data)/im;
	var ctrlCharactersRegex = /[^\x20-\x7E]/gmi;
	var urlSchemeRegex = /^([^:]+):/gm;

	var urlScheme;
	var sanitizedUrl = url.replace(ctrlCharactersRegex, '');
	var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);

	if (!urlSchemeParseResults) {
		return 'about:blank';
	}

	urlScheme = urlSchemeParseResults[0];

	if (invalidPrototcolRegex.test(urlScheme)) {
		return 'about:blank';
	}

	return sanitizedUrl;
}

