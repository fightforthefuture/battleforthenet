/// <reference path="../typings/index.d.ts" />


import * as Bacon from 'baconjs';


export class EventEmitter {
	bus: Bacon.Bus<any, any>;
	constructor() {
		this.bus = new Bacon.Bus();
		window.addEventListener("scroll", (evt) => {
			this.bus.push(evt);
		});
		window.addEventListener("resize", (evt) => {
			this.bus.push(evt);
		});
	}
	on(event: string, cb: (evt:any)=>void)  {
		var unsub = this.bus.onValue(function(evt) {
			if (event === "all" || evt.type === event) {
				cb(evt);
			}
		});
		return unsub;
	}
}
