import { templates as t } from "redux/ui/prompts";
import LotPurchasePrompt from "ui/prompts/LotPurchase";
import LotUpgradePrompt from "ui/prompts/LotUpgrade";

const map = {
	[t.LOT_PURCHASE]: LotPurchasePrompt,
	[t.LOT_UPGRADE]: LotUpgradePrompt
};

export default function inflate([promptId, { template: templateId, ...data }]) {
	let PromptTemplate = map[templateId];

	return (
		<PromptTemplate
			key={promptId}
			promptId={promptId}
			data={data}
		/>
	);
}
