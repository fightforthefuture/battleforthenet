/// <reference path="../typings/index.d.ts" />


export class MockDeferred {
	result: any
	success: boolean
	timeout: number
	completed: boolean
	done_cb: any
	fail_cb: any
	always_cb: any
	constructor(result: any, success: boolean, timeout: number) {
		this.result = result;
		this.success = success;
		this.timeout = timeout;
		this.completed = false;
		this.done_cb = null;
		this.fail_cb = null;
		this.always_cb = null;
	}
	done(cb: any) {
		this.done_cb = cb;
		this.complete();
		return this;
	}
	fail(cb: any) {
		this.fail_cb = cb;
		this.complete();
		return this;
	}
	always(cb: any) {
		this.always_cb = cb;
		this.complete();
		return this;
	}
	complete() {
		if (this.completed === false) {
			this.completed = true;
			window.setTimeout(() => {
				if (this.success === true) {
					if (this.done_cb) {
						this.done_cb(this.result);
					}
				} else {
					if (this.fail_cb) {
						this.fail_cb(this.result);
					}
				}
				if (this.always_cb) {
					this.always_cb(this.result);
				}
			}, this.timeout);
		}
	}
}

