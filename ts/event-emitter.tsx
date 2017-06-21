/// <reference path="../typings/index.d.ts" />


import {Bus} from './bus';


export class EventEmitter {
	bus: Bus;
	constructor() {
		this.bus = new Bus();
		window.addEventListener("scroll", (evt) => {
			this.bus.push(evt);
		});
		window.addEventListener("resize", (evt) => {
			this.bus.push(evt);
		});
	}
	on(event: string, cb: (evt:any)=>void)  {
		var unsub = this.bus.subscribe(function(evt) {
			if (event === "all" || evt.type === event) {
				cb(evt);
			}
		});
		return unsub;
	}
}
