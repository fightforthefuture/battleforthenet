/// <reference path="../typings/index.d.ts" />

export class ExternalFlags {
	params: URLSearchParams
	constructor() {
		this.params = new URLSearchParams(window.location.search.substring(1));
	}

	has(flag: string) {
		return !!this.params.get(flag);
	}

	get(flag: string) {
        // TODO: This should probably return undefined if the param does not exist?
		return this.params.get(flag) || '';
	}
}
