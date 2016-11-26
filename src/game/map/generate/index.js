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
		const upgradeCost = generateUpgrades();
		const rent = generateRent(price, upgradeCost);

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