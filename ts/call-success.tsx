import * as React from 'react';


interface Props {
	setModal: (modal: string | null)=>any
}

interface State {
}

export class CallSuccess extends React.Component<Props, State> {
	render() {
		return (
			<div>
				<h2>Calling you now!</h2>
				<h4>
					Press * after each call to start the next one.
					Hang up whenever you like, but
					<em>more calls = more impact.</em>
				</h4>

				<p><em>You can say:</em></p>
				<p>In 2015 &mdash; after millions of us spoke out &mdash; the Federal Communications Commission put strong net neutrality rules in place. They protect the internet and make sure that Americans can use it for speech, commerce, and other important functions.</p>
				<p>Now the FCC is trying to undo those rules and let internet service providers manipulate our data to suit their corporate interests. I oppose the FCC’s efforts to roll back Title II net neutrality rules &mdash; and I urge you to oppose them as well.</p>
			</div>
		);
	}
}

