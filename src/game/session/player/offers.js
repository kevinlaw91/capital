import shortid from "shortid";

// Offers collection
const offers = new Map();

/** Create an offer */
export function createOffer() {
	const id = shortid.generate();

	return {
		id,
		response: new Promise((accept, decline) => {
			offers.set(id, { accept, decline });
		})
	};
}
/** Remove offer */
const removeOffer = id => offers.delete(id);

export const acceptOffer = id => {
	if (offers.has(id)) {
		offers.get(id).accept();
		removeOffer(id);
	} else {
		console.warn("Accepting expired offer.");
	}
};

export const rejectOffer = id => {
	if (offers.has(id)) {
		offers.get(id).decline();
		removeOffer(id);
	} else {
		console.warn("Rejecting expired offer.");
	}
};
