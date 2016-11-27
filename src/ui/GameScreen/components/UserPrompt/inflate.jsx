import { templates as t } from "redux/ui/prompts";
import LotPurchase from "ui/prompts/LotPurchase";
import LotUpgrade from "ui/prompts/LotUpgrade";

export default function inflate([promptId, { template, ...data }]) {
	switch (template) {
		case t.LOT_PURCHASE:
			return (
				<LotPurchase
					key={promptId}
					promptId={promptId}
					location={data.location}
					price={data.price}
				/>
			);

		case t.LOT_UPGRADE:
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
