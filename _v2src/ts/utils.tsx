/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function mountComponent(el: React.ReactElement<any>, target: any) {
	ReactDOM.render(el, target);
}
