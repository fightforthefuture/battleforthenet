/// <reference path="../typings/index.d.ts" />


export class SelectOnFocus {
	static wrapElement(target: HTMLInputElement) {
		target.addEventListener("focus", function(evt) {
			target.select();
		});
	}
}
