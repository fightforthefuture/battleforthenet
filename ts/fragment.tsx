import * as React from 'react';

interface Props {
	fragmentId: string
}

export class Fragment extends React.Component<Props> {
	render() {
		var rootEl = document.getElementById(this.props.fragmentId);
		var rawHTML: string;
		if (rootEl) {
			rawHTML = rootEl.innerHTML;
		} else {
			rawHTML = "";
		}
		var html: any = {
			__html: rawHTML
		};
		return <div dangerouslySetInnerHTML={html}/>;
	}
}
