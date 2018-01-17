import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props { }
interface State { }

export class TestComponent extends React.Component<Props, State> {
	render() {
		return <h1>Hello world</h1>;
	}
}
