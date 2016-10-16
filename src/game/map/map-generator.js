import GameMap from "./GameMap";
import RandomNameGenerator from "./name-generator";
import generateCost from "./cost-generator";
import generateRent from "./rent-generator";

/**
 * Generate sprites position based on index and side of the lot
 * @param side
 * @param index
 * @returns {Object}
 */
function generateLotAnchors(side, index) {
	switch (side) {
		case "S":
			return {
				// x = 12, 11, 10 ... 4
				tilePosition: { x: 12 - index, y: 13 },
				tokenPosition: { x: 12 - index, y: 13 },
				buildingPosition: { x: 12 - index, y: 15 },
			};
		case "W":
			return {
				// y = 12, 11, 10 ... 4
				tilePosition: { x: 3, y: 12 - index },
				tokenPosition: { x: 3, y: 12 - index },
				buildingPosition: { x: 1, y: 12 - index },
			};
		case "N":
			return {
				// x = 4, 5, 6 ... 12
				tilePosition: { x: 4 + index, y: 3 },
				tokenPosition: { x: 4 + index, y: 3 },
				buildingPosition: { x: 4 + index, y: 1 },
			};
		case "E":
			return {
				// y = 4, 5, 6 ... 12
				tilePosition: { x: 13, y: 4 + index },
				tokenPosition: { x: 13, y: 4 + index },
				buildingPosition: { x: 15, y: 4 + index },
			};
	}
}

export default function generate() {
	const nameGenerator = RandomNameGenerator();
	const map = new GameMap();

	// Bottom corner
	map.update("CORNER-BOTTOM", {
		tilePosition: { x: 13, y: 13 },
		tokenPosition: { x: 13, y: 13 },
	});

	// Left corner
	map.update("CORNER-LEFT", {
		tilePosition: { x: 3, y: 13 },
		tokenPosition: { x: 3, y: 13 },
	});

	// Top corner
	map.update("CORNER-TOP", {
		tilePosition: { x: 3, y: 3 },
		tokenPosition: { x: 3, y: 3 },
	});

	// Right corner
	map.update("CORNER-RIGHT", {
		tilePosition: { x: 13, y: 3 },
		tokenPosition: { x: 13, y: 3 },
	});

	// Property lot
	for (let side of GameMap.SIDES) {
		for (let i = 0; i < GameMap.LOT_COUNT; i++) {
			let paddedIndex = `${i.toString().padStart(2, "0")}`; // Zero padded
			let id = GameMap.getLotId(side, paddedIndex);

			const generatedCost = generateCost();
			const generatedRent = generateRent(generatedCost);

			// Extra properties
			const extras = {
				// Cost to buy/upgrade
				cost: generatedCost,
				// Rental rates
				rent: generatedRent,
			};

			map.update(id, [
				// Unique properties for each lot
				{
					name: nameGenerator.next().value,
					tradable: true,
				},
				// Generate position of sprites
				generateLotAnchors(side, i),
				// Extras
				extras,
			]);
		}
	}

	return map;
}