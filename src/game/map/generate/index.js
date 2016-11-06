import { batchActions } from "redux-batched-actions";
import getState from "redux/getState";
import { selectAllEntities as selectAllMapEntities } from "redux/game/session/map";
import { actions as lotActions } from "redux/lot";
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
				lotActions.setName(id, nameGenerator.next().value),
				lotActions.setTradable(id, true),
				lotActions.setPrice(id, price),
				lotActions.setUpgradeCost(id, upgradeCost),
				lotActions.setRent(id, rent),
			])
		);
	});

	return batch;
}