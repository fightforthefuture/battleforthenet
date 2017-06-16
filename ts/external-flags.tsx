/// <reference path="../typings/index.d.ts" />

export class ExternalFlags {
	params: URLSearchParams
	constructor() {
		this.params = new URLSearchParams(window.location.search.substring(1));
	}

	hasFlag(flag: string) {
		return !!this.params.get(flag);
	}

	getFlag(flag: string, defaultValue: any) {
		return this.params.get(flag) || defaultValue;
	}
}
