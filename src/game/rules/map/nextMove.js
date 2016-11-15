export default currentPos => ({
	"CORNER-BOTTOM": "LOT-S0",

	// South
	"LOT-S0": "LOT-S1",
	"LOT-S1": "LOT-S2",
	"LOT-S2": "LOT-S3",
	"LOT-S3": "LOT-S4",
	"LOT-S4": "LOT-S5",
	"LOT-S5": "LOT-S6",
	"LOT-S6": "LOT-S7",
	"LOT-S7": "LOT-S8",
	"LOT-S8": "CORNER-LEFT",

	"CORNER-LEFT": "LOT-W0",

	// West
	"LOT-W0": "LOT-W1",
	"LOT-W1": "LOT-W2",
	"LOT-W2": "LOT-W3",
	"LOT-W3": "LOT-W4",
	"LOT-W4": "LOT-W5",
	"LOT-W5": "LOT-W6",
	"LOT-W6": "LOT-W7",
	"LOT-W7": "LOT-W8",
	"LOT-W8": "CORNER-TOP",

	"CORNER-TOP": "LOT-N0",

	// North
	"LOT-N0": "LOT-N1",
	"LOT-N1": "LOT-N2",
	"LOT-N2": "LOT-N3",
	"LOT-N3": "LOT-N4",
	"LOT-N4": "LOT-N5",
	"LOT-N5": "LOT-N6",
	"LOT-N6": "LOT-N7",
	"LOT-N7": "LOT-N8",
	"LOT-N8": "CORNER-RIGHT",

	"CORNER-RIGHT": "LOT-E0",

	// East
	"LOT-E0": "LOT-E1",
	"LOT-E1": "LOT-E2",
	"LOT-E2": "LOT-E3",
	"LOT-E3": "LOT-E4",
	"LOT-E4": "LOT-E5",
	"LOT-E5": "LOT-E6",
	"LOT-E6": "LOT-E7",
	"LOT-E7": "LOT-E8",
	"LOT-E8": "CORNER-BOTTOM",
}[currentPos]);