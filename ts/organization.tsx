/// <reference path="../typings/index.d.ts" />

import {ExternalFlags} from './external-flags';

interface State {
  org: string
  name: string
  url: string
}

function randomOrg() {
  var coinToss = Math.random();

  if (coinToss < .20) {
    return 'fp';
  } else if (coinToss < .60) {
    return 'dp';
  } else {
    return 'fftf';
  }
}

export class Organization {
    state: State

	constructor() {
      var params = new ExternalFlags();
      this.set(params.has('org') ? params.get('org') : 'fftf');
	}

    set(org: string) {
      switch(org) {
        case 'dp':
          this.state = {
            org: 'dp',
            name: 'Demand Progress',
            url: 'https://demandprogress.org/'
          }
          break;
        case 'fp':
          this.state = {
            org: 'fp',
            name: 'Free Press',
            url: 'https://www.freepress.net/'
          }
          break;
        case 'fftf':
        default:
          this.state = {
            org: 'fftf',
            name: 'Fight for the Future',
            url: 'https://www.fightforthefuture.org/'
          }
      }
    }

    getOrg() {
      return this.state.org;
    }

    getName() {
      return this.state.name;
    }

    getURL() {
      return this.state.url;
    }
}
