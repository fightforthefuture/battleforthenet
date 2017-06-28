import {ExternalFlags} from './external-flags';

export interface Organization {
	code: string
	name: string
	url: string
}

function getRandomOrg() {
	var coinToss = Math.random();
	if (coinToss < .20) {
		return 'fp';
	} else if (coinToss < .60) {
		return 'dp';
	} else {
		return 'fftf';
	}
}

export function getOrganization(params: ExternalFlags) {
	var org = params.get('org', getRandomOrg());
	switch(org) {
		case 'dp':
			return {
				code: 'dp',
				name: 'Demand Progress',
				url: 'https://demandprogress.org/'
			};
		case 'fp':
			return {
				code: 'fp',
				name: 'Free Press',
				url: 'https://www.freepress.net/'
			};
		case 'fftf':
		default:
			return {
				code: 'fftf',
				name: 'Fight for the Future',
				url: 'https://www.fightforthefuture.org/'
			};
	}
}
