import dispatch from "redux/dispatch";
import { templates as t } from "redux/ui/prompts";
import { actions as promptsAction } from "redux/ui/prompts";
import {
	enableTransitions,
	disableTransitions,
} from "ui/GameScreen/components/UserPrompt";

// Preload templates to prevent FOUC
export function preload() {
	// Disable transitions when preloading
	disableTransitions();

	dispatch(promptsAction.create(t.LOT_PURCHASE, "PRELOAD_LOT_PURCHASE"));
	dispatch(promptsAction.remove("PRELOAD_LOT_PURCHASE"));

	dispatch(promptsAction.create(t.LOT_UPGRADE, "PRELOAD_LOT_UPGRADE"));
	dispatch(promptsAction.remove("PRELOAD_LOT_UPGRADE"));

	// Re-enable transition
	enableTransitions();

	return Promise.resolve();
}
