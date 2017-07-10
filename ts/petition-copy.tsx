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
						: `Comcast & Verizon want to end net neutrality so they can control what we see & do online.
							In ${daysLeft} ${dayLabel}, the FCC will let them, unless we stop it.
						  This is a battle for the Internet's future.`
					}
					{" "}
					<em>
						{ etsy
				  		? "Send a message to the FCC and Congress urging them to protect net neutrality and microbusinesses. "
							: "Before you do anything else, send a letter to the FCC & Congress now!"
						}
					</em>
				</p>
			</div>
		);
	}
}
