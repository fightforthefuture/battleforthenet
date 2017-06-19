/// <reference path="../typings/index.d.ts" />

import * as React from 'react';


interface Props {
}


interface State {
}


export class PetitionCopy extends React.Component<Props, State> {
	render() {
		return (
			<div className="petition-copy">
				<p>
					Comcast &amp; Verizon want to end net neutrality so they can control what we see &amp; do online.
					In 82 days, the FCC will let them, unless we stop it.
					This is a battle for the Internet's future.
					{" "}
					<em>Before you do anything else, send a letter to the FCC &amp; Congress now!</em>
				</p>
			</div>
		);
	}
}
