import * as React from 'react';

import {daysUntil} from './utils';


interface Props {
	deadline: Date
	etsy: boolean | false
}


interface State {
}


export class PetitionCopy extends React.Component<Props, State> {
	render() {
		const daysLeft = daysUntil(this.props.deadline);
		const dayLabel = (daysLeft > 1) ? "days" : "day";
		const etsy = this.props.etsy;
		return (
			<div className="petition-copy">
				<p>
					{ etsy
						? `FCC Chairman Pai wants to repeal existing net neutrality rules that allow Etsy sellers to turn their creative passion into a business. Without these protections, Etsy sellers will be forced to choose between paying for priority access or losing sales in the internet slow lane.`
						: <span>Comcast, Verizon and AT&T want to end net neutrality so they can control what we see & do online.
							First, they want to gut FCC rules. Then, they plan to pass bad legislation that allows extra fees, throttling & censorship.</span>
					}
					{" "}
					<em>
						{ etsy
				  		? "Send a message to the FCC and Congress urging them to protect net neutrality and microbusinesses. "
							: "Time is running out to stop them. Write Congress & the FCC now!"
						}
					</em>
				</p>
			</div>
		);
	}
}
