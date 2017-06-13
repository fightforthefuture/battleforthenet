/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';


export function handleInputChange(evt: React.FormEvent) {
	const target = evt.target as HTMLInputElement;
	const val = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;
	var data:any = {};
	data[name] = val;
	this.setState(data);
}

export function mountComponent(el: React.ReactElement<any>, target: any) {
	ReactDOM.render(el, target);
}
