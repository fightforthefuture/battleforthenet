import * as React from 'react';


interface Props {
	modalClass?: string | null
	contentStyle?: any
	onClose?: ()=>any
}


interface State {
}


export class Modal extends React.Component<Props, State> {
	componentDidMount() {
		document.body.classList.add("no-scroll");
	}
	componentWillUnmount() {
		document.body.classList.remove("no-scroll");
	}
	renderModalClose() {
		return (
			<div className="modal-close" onClick={this.props.onClose}>
				<span className="oi" data-glyph="circle-x" title="close" aria-hidden="true"></span>
			</div>
		);
	}
	render() {
		var className = "modal";
		if (this.props.modalClass) {
			className = className + " " + this.props.modalClass;
		}
		return (
			<div className={className}>
				<div className="modal-background" onClick={this.props.onClose || void(0)}></div>
				<div className="modal-content-container">
					<div className="modal-content" style={this.props.contentStyle}>
						{ this.props.children }
						{ this.props.onClose ? this.renderModalClose() : null }
					</div>
				</div>
			</div>
		);
	}
}
