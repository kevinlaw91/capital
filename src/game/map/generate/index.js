import { batchActions } from "redux-batched-actions";

import getState from "../../utils/getState";
import {
	selectAllMapEntities,
	actions
} from "../../../redux/game/session/map";

import NameGenerator from "./name";
import generatePrice from "./price";
import generateUpgrades from "./upgrades";
import generateRent from "./rent";

export default function () {
	const nameGenerator = NameGenerator();

	// Read state tree
	const map = selectAllMapEntities(getState());

	// Collection of mutation actions for each property lot
	const batch = [];

	// Generate properties
	Object.keys(map).forEach(id => {
		// Price
		const price = generatePrice();

		// Upgrade cost
		let upgradeCost = generateUpgrades();
		upgradeCost = {
			TIER_1: upgradeCost[0],
			TIER_2: upgradeCost[1],
			TIER_3: upgradeCost[2],
			TIER_4: upgradeCost[3],
		};

		// Rent
		const rent = generateRent({ TIER_0: price, ...upgradeCost });

		batch.push(
			batchActions([
				actions.setName(id, nameGenerator.next().value),
				actions.setTradable(id, true),
				actions.setPrice(id, price),
				actions.setUpgradeCost(id, upgradeCost),
				actions.setRent(id, rent),
			])
		);
	});

	return batch;
}