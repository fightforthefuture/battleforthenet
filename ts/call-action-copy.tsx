import * as React from 'react';


interface Props {
}


interface State {
}


export class CallActionCopy extends React.Component<Props, State> {
	render() {
		return (
			<div className="call-action-copy">
				<p>
					The FCC wants to destroy net neutrality and give big cable companies
					control over what we see and do online. If they get their way, they’ll
					allow widespread throttling, blocking, censorship, and extra fees.
					{" "}
					<em>To protect free speech and keep the Internet awesome, we need to reach
					decision makers with comments, emails, and phone calls right now.</em>
				</p>
			</div>
		);
	}
}
