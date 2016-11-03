import gaussian from "./gaussian";
import clamp from "js/utils/clamp";

export default function (min, avg, max) {
	// Generate a number from gaussian distribution
	// and clamp the result into the range of min and max
	const rnd = gaussian(avg, (max - min) / 2);

	return clamp(rnd, min, max);
}