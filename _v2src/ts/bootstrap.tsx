/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {TestComponent} from './test';
import {StatsComponent} from './stats';
import {VideoRollComponent} from './video-roll';
import {ScrollToggler} from './scroll-toggler';
import {LoaderLogo} from './loader-logo';
import {mountComponent} from './utils';

declare var window: any;

window['React'] = React;
window['ReactDOM'] = ReactDOM;
window['TestComponent'] = TestComponent;
window['StatsComponent'] = StatsComponent;
window['VideoRollComponent'] = VideoRollComponent;
window['ScrollToggler'] = ScrollToggler;
window['LoaderLogo'] = LoaderLogo;
window['mountComponent'] = mountComponent;
