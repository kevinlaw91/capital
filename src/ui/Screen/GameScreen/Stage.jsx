import { setup as setupSVGPanZoom } from "../../../js/renderer/panzoom";
import SymbolStore from "./SymbolStore";

export default class Stage extends React.Component {
	constructor(props) {
		super(props);
		this.setAsSVG = this.setAsSVG.bind(this);
		this.setAsStageRoot = this.setAsStageRoot.bind(this);
	}

	componentDidMount() {
		// Wait for DOM painting to finish before initialize svg-pan-zoom
		// http://stackoverflow.com/a/28748160/585371
		setTimeout(() => window.requestAnimationFrame(() => setupSVGPanZoom(this._svg, this._stageRoot)), 0);
	}

	setAsSVG(element) { this._svg = element; }
	setAsStageRoot(element) { this._stageRoot = element; }

	render() {
		return (
			<svg width="100%" height="100%" ref={ this.setAsSVG }>
				<SymbolStore />
				<g ref={ this.setAsStageRoot }>
					<rect x="0" y="0" width="1920" height="1080" fill="transparent" stroke="#555" strokeWidth="5"> {/* Scene placeholder */} </rect>
				</g>
			</svg>
		);
	}
}