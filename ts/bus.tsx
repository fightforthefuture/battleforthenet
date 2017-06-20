/// <reference path="../typings/index.d.ts" />


import * as _ from 'lodash';


export class Bus {
	subscribers: any[];
	constructor() {
		this.subscribers = [];
	}
	push(val:any) {
		_.each(this.subscribers, function(cb) {
			cb(val);
		});
	}
	subscribe(cb: (val:any)=>void) {
		this.subscribers.push(cb);
		return () => {
			_.pull(this.subscribers, cb);
		};
	}
}
