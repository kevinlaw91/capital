import { setViewportElement } from "../utils/camera";
import FloorLayer from "./layers/FloorLayer";
import TokenLayer from "./layers/TokenLayer";

export default function StageCanvas() {
	return (
		<g ref={ setViewportElement }>
			<rect width="1" height="1" fill="transparent">
				/* Placeholder element to prevent svg-pan-zoom from generating errors if content is empty */
			</rect>
			<FloorLayer />
			<TokenLayer />
		</g>
	);
}