/// <reference path="../typings/index.d.ts" />

declare module 'react-transition-group' {
	import * as React from 'react';

	type CSSTransitionGroup = React.ComponentClass<any>;
	export var CSSTransitionGroup: CSSTransitionGroup;
}
