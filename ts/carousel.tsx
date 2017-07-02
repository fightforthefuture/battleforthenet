import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import * as Hammer from 'react-hammerjs';


import {EventEmitter} from './event-emitter';
import {clamp, classes, noop} from './utils';


interface Props {
	items: any[]
	width: number
	height: number
	padding: number
	pagePadding: number
	eventEmitter: EventEmitter
	renderItem: (item:any)=>JSX.Element
}


interface State {
	active: number
	visibleItems: number
	width: number
	height: number
}


interface ItemPosition {
	idx: number
	item: any
	left: number
	active: boolean
	isEndCap: boolean
}


function getVisibleItems(props:Props): number {
	var ww = window.innerWidth - (props.pagePadding * 2);
	return Math.floor(ww / (props.width + props.padding));
}


function getContainerPadding(props:Props, state:State): number {
	var ww = window.innerWidth;
	return Math.floor((ww - (state.visibleItems * (state.width + props.padding))) / 2);
}


function getItemPositions(props:Props, state:State): ItemPosition[] {
	var l = props.items.length;
	var s = Math.floor((l - state.visibleItems) / 2);
	var i = clamp(state.active - s, l);
	var left = -s;
	var ret: ItemPosition[] = [];
	var d = getScrollDelta(props, state) + 1;
	_.each(_.range(0, l), function(j) {
		var idx = clamp(i + j, l);
		var offset = left + j;
		if (offset >= -(d) && offset <= state.visibleItems + d) {
			ret.push({
				idx: idx,
				item: props.items[idx],
				left: offset,
				active: (offset < state.visibleItems) && (offset >= 0),
				isEndCap: (j === 0 || j === (l - 1))
			});
		}
	});
	return ret;
}

function getScrollDelta(props:Props, state:State): number {
	var v = state.visibleItems;
	var l = props.items.length;
	if (l > v * 3) {
		return v;
	} else {
		return Math.max(1, Math.floor((l - v) / 2));
	}
}

export class Carousel extends React.Component<Props, State> {
	_handleResize: ()=>void;
	_unsub: ()=>void;
	constructor(props:Props) {
		super(props);
		this.state = {
			active: 0,
			visibleItems: Math.max(1, getVisibleItems(props)),
			width: props.width,
			height: props.height
		};
		this._handleResize = _.debounce(this.handleResize.bind(this), 25);
	}
	componentDidMount() {
		this._unsub = this.props.eventEmitter.on("resize", this._handleResize);
		this._handleResize();
	}
	componentWillUnmount() {
		this._unsub();
	}
	handleResize(evt:Event) {
		var v = getVisibleItems(this.props);
		var h = this.props.height;
		var w = this.props.width;
		if (v < 1) {
			v = 1;
			var ratio = h / w;
			w = Math.floor(window.innerWidth - this.props.pagePadding);
			h = Math.floor(w * ratio);
		}
		this.setState({
			visibleItems: v,
			width: w,
			height: h
		} as State);
	}
	onSwipe(evt: Event): void {
		evt.preventDefault();
		var d = (evt as any)["direction"] as number;
		if (d) {
			if (d === 2) {
				this.setState((prevState) => {
					return _.defaults({
						active: clamp(prevState.active + getScrollDelta(this.props, this.state), this.props.items.length)
					}, prevState) as State;
				});
			} else if (d === 4) {
				this.setState((prevState) => {
					return _.defaults({
						active: clamp(prevState.active - getScrollDelta(this.props, this.state), this.props.items.length)
					}, prevState) as State;
				});
			}
		}
	}
	onPrev(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return _.defaults({
				active: clamp(prevState.active - getScrollDelta(this.props, this.state), this.props.items.length)
			}, prevState) as State;
		});
	}
	onNext(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.setState((prevState) => {
			return _.defaults({
				active: clamp(prevState.active + getScrollDelta(this.props, this.state), this.props.items.length)
			}, prevState) as State;
		});
	}
	renderItem(ip: ItemPosition): JSX.Element {
		var idx = ip.idx;
		var item = ip.item;
		var left = ip.left * (this.state.width + this.props.padding);
		var cls = classes(
			"carousel-item",
			ip.isEndCap && "carousel-item-end",
			ip.active && "carousel-item-active"
		);
		return (
			<div className={cls} key={"item-"+idx} style={{left: left, width: this.state.width}}>
				{ this.props.renderItem(item) }
			</div>
		);
	}
	renderControls(): JSX.Element|null {
		var chunk = 100 / this.props.items.length;
		var width = chunk + "%";
		var left = (chunk * this.state.active) + "%";
		var padding = getContainerPadding(this.props, this.state);
		return (
			<div className="controls">
				<div className="bar">
					<div className="section" style={{width: width, left: left}}></div>
				</div>
				<div className="prev" onClick={this.onPrev.bind(this)} style={{width: padding}}>
					<div>
						<span className="oi" data-glyph="chevron-left" title="previous" aria-hidden="true"></span>
					</div>
				</div>
				<div className="next" onClick={this.onNext.bind(this)} style={{width: padding}}>
					<div>
						<span className="oi" data-glyph="chevron-right" title="next" aria-hidden="true"></span>
					</div>
				</div>
			</div>
		);
	}
	render(): JSX.Element {
		var itemPositions = getItemPositions(this.props, this.state);
		var left = getContainerPadding(this.props, this.state);
		var showControls = (this.props.items.length > this.state.visibleItems);
		return (
			<div className="carousel">
				<Hammer onSwipe={showControls ? this.onSwipe.bind(this) : noop}>
					<div className="carousel-container">
						<div className="carousel-scroller" style={{left: left}}>
							{_.map(itemPositions, this.renderItem.bind(this))}
						</div>
					</div>
				</Hammer>
				{ showControls ? this.renderControls() : null}
			</div>
		);
	}
}
