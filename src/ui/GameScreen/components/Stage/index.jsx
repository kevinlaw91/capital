import { setSVGElement, init } from "../../../utils/camera";
import StageCanvas from "../../../StageCanvas";

export default class Stage extends React.Component {
	componentDidMount() {
		// At this point StageCanvas was alredy mounted and refs was stored in module
		// Now wait for DOM painting to finish before initialize svg-pan-zoom
		// http://stackoverflow.com/a/28748160/585371
		setTimeout(() => window.requestAnimationFrame(init), 0);
	}

	render() {
		return (
			<svg width="100%" height="100%" ref={ setSVGElement }>
				<StageCanvas />
			</svg>
		);
	}
}