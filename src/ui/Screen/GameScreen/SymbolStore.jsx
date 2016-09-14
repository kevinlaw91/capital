import { store } from "../../../js/assets/symbols";

let fragment = {
	__html: store.join("")
};

export default function SymbolStore() {
	return (
		<defs dangerouslySetInnerHTML={fragment} />
	);
}