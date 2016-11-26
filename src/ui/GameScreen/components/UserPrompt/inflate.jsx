import * as t from "ui/prompts/templates";
import LotPurchase from "ui/prompts/LotPurchase";
import LotUpgrade from "ui/prompts/LotUpgrade";

export default function inflate([promptId, { template, ...data }]) {
	switch (template) {
		case t.LotPurchase:
			return (
				<LotPurchase
					key={promptId}
					promptId={promptId}
					location={data.location}
					price={data.price}
				/>
			);

		case t.LotUpgrade:
			return (
				<LotUpgrade
					key={promptId}
					promptId={promptId}
					location={data.location}
					cost={data.cost}
				/>
			);
	}
}
