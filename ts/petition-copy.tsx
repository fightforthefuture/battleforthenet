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
					Comcast &amp; Verizon want the power to control what we see &amp; do online.
					The FCC will let them, unless we stop it.
					This is a battle for the Internet's future.
					{" "}
					<em>Before you do anything else,send a letter to the FCC now</em>
				</p>
			</div>
		);
	}
}
