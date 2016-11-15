import * as t from "ui/prompts/templates";
import LotPurchase from "ui/prompts/LotPurchase";

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
	}
}