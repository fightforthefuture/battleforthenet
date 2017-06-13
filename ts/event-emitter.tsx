/// <reference path="../typings/index.d.ts" />

import * as $ from 'jquery';
import * as Bacon from 'baconjs';

export class EventEmitter {
	bus: Bacon.Bus<any, any>;
	constructor() {
		this.bus = new Bacon.Bus();
		$(window).on("scroll", (evt) => {
			this.bus.push(evt);
		});
		$(window).on("resize", (evt) => {
			this.bus.push(evt);
		});
	}
	on(event: string, cb: (evt:any)=>void)  {
		var unsub = this.bus.onValue(function(evt) {
			if (evt.type === event) {
				cb(evt);
			}
		});
		return unsub;
	}
}
