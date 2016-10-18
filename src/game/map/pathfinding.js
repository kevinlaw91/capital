// Player token starting point
const START_LOCATION = "CORNER-BOTTOM";

// Player token moving path
const path = {
	"CORNER-BOTTOM": "LOT-S00",

	// South
	"LOT-S00": "LOT-S01",
	"LOT-S01": "LOT-S02",
	"LOT-S02": "LOT-S03",
	"LOT-S03": "LOT-S04",
	"LOT-S04": "LOT-S05",
	"LOT-S05": "LOT-S06",
	"LOT-S06": "LOT-S07",
	"LOT-S07": "LOT-S08",
	"LOT-S08": "CORNER-LEFT",

	"CORNER-LEFT": "LOT-W00",

	// West
	"LOT-W00": "LOT-W01",
	"LOT-W01": "LOT-W02",
	"LOT-W02": "LOT-W03",
	"LOT-W03": "LOT-W04",
	"LOT-W04": "LOT-W05",
	"LOT-W05": "LOT-W06",
	"LOT-W06": "LOT-W07",
	"LOT-W07": "LOT-W08",
	"LOT-W08": "CORNER-TOP",

	"CORNER-TOP": "LOT-N00",

	// North
	"LOT-N00": "LOT-N01",
	"LOT-N01": "LOT-N02",
	"LOT-N02": "LOT-N03",
	"LOT-N03": "LOT-N04",
	"LOT-N04": "LOT-N05",
	"LOT-N05": "LOT-N06",
	"LOT-N06": "LOT-N07",
	"LOT-N07": "LOT-N08",
	"LOT-N08": "CORNER-RIGHT",

	"CORNER-RIGHT": "LOT-E00",

	// East
	"LOT-E00": "LOT-E01",
	"LOT-E01": "LOT-E02",
	"LOT-E02": "LOT-E03",
	"LOT-E03": "LOT-E04",
	"LOT-E04": "LOT-E05",
	"LOT-E05": "LOT-E06",
	"LOT-E06": "LOT-E07",
	"LOT-E07": "LOT-E08",
	"LOT-E08": "CORNER-BOTTOM",
};

/**
 * Find position for next move
 * @param currentPosition
 * @return {string}
 */
export function findNextMove(currentPosition) {
	if (currentPosition) {
		if (path[currentPosition]) {
			return path[currentPosition];
		} else {
			throw "Unable to find next move.";
		}
	} else {
		// No current position was specified
		// Go to to starting point
		return START_LOCATION;
	}
}