import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Promise from 'native-promise-only';
import * as ClassList from 'classlist-polyfill';
import * as URL from 'url-polyfill';
import * as fetch from 'whatwg-fetch';


declare global {
	interface Window {
		actionKitSubmitSuccess: (response : Object) => any
	}
	var fbq: any
	var ga: any
}


declare var window: any;

import {TestComponent} from './test';
import {VideoRollComponent} from './video-roll';
import {PersistentButton} from './persistent-button';
import {LoaderLogo} from './loader-logo';
import {EventEmitter} from './event-emitter';
import {BFTNFormFlow} from './bftn-form-flow';
import {mountComponent} from './utils';
import {ExternalFlags} from './external-flags';
import {GoogleAnalytics} from './google-analytics';
import {TwitterBrigade} from './twitter-brigade';
import {PoliticalScoreboard} from './political-scoreboard';
import {UberPoliticalScoreboard} from './uber-political-scoreboard';
import {getOrganization} from './organization';
import {Leaderboard} from './leaderboard';

window['_promise'] = Promise;
window['_classlist'] = ClassList;
window['_url'] = URL;
window['_fetch'] = fetch;
window['React'] = React;
window['ReactDOM'] = ReactDOM;
window['TestComponent'] = TestComponent;
window['VideoRollComponent'] = VideoRollComponent;
window['PersistentButton'] = PersistentButton;
window['LoaderLogo'] = LoaderLogo;
window['EventEmitter'] = EventEmitter;
window['BFTNFormFlow'] = BFTNFormFlow;
window['mountComponent'] = mountComponent;
window['ExternalFlags'] = ExternalFlags;
window['GoogleAnalytics'] = GoogleAnalytics;
window['TwitterBrigade'] = TwitterBrigade;
window['PoliticalScoreboard'] = PoliticalScoreboard;
window['UberPoliticalScoreboard'] = UberPoliticalScoreboard;
window['Leaderboard'] = Leaderboard;
window['getOrganization'] = getOrganization;
