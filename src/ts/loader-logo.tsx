import * as React from 'react';

interface Props { }
interface State {
	i: number
}

export class LoaderLogo extends React.Component<Props, State> {
	_interval: number;
	constructor(props:Props) {
		super(props);
		this.state = {
			i: 0
		}
	}
	onTick() {
		this.setState((oldState) => {
			return {
				i: (oldState.i + 1) % 8
			};
		});
	}
	componentDidMount() {
		this._interval = window.setInterval(this.onTick.bind(this), 150);
	}
	componentWillUnmount() {
		window.clearInterval(this._interval);
	}
	render() {
		const i = this.state.i;
		return (
			<div className="loader">
				<div key="a" className={"chord chord-a chord-" + ((i + 7) % 8)}><span className="ray"></span></div>
				<div key="b" className={"chord chord-b chord-" + ((i + 6) % 8)}><span className="ray"></span></div>
				<div key="c" className={"chord chord-c chord-" + ((i + 5) % 8)}><span className="ray"></span></div>
				<div key="d" className={"chord chord-d chord-" + ((i + 4) % 8)}><span className="ray"></span></div>
				<div key="e" className={"chord chord-e chord-" + ((i + 3) % 8)}><span className="ray"></span></div>
				<div key="f" className={"chord chord-f chord-" + ((i + 2) % 8)}><span className="ray"></span></div>
				<div key="g" className={"chord chord-g chord-" + ((i + 1) % 8)}><span className="ray"></span></div>
				<div key="h" className={"chord chord-h chord-" + ((i + 0) % 8)}><span className="ray"></span></div>
			</div>
		);
	}
}
