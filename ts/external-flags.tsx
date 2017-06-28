export class ExternalFlags {
	params: URLSearchParams
	constructor() {
		this.params = new URLSearchParams(window.location.search.substring(1));
	}

	has(flag: string) {
		return !!this.params.get(flag);
	}

	get(flag: string, defaultVal: string|undefined) {
		return this.params.get(flag) || defaultVal;
	}
}
