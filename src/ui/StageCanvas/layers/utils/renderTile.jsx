import FloorTile from "../components/FloorTile";

/** Convert tile definition object into FloorTile element */

// eslint-disable-next-line react/display-name
export default function (entry) {
	const { id, ...other } = entry;

	return (
		<FloorTile key={id} {...other} />
	);
}