import Immutable from "seamless-immutable";

import { reducerFactory } from "./sideReducerFactory";

const tileDefault = Immutable({
	symbol: "lot-west",
	variant: "01",
});

// Initial state
const initialState = Immutable({
	"TILE-WEST-4": tileDefault,
	"TILE-WEST-5": tileDefault,
	"TILE-WEST-6": tileDefault,
	"TILE-WEST-7": tileDefault,
	"TILE-WEST-8": tileDefault,
	"TILE-WEST-9": tileDefault,
	"TILE-WEST-10": tileDefault,
	"TILE-WEST-11": tileDefault,
	"TILE-WEST-12": tileDefault,
});

// Reducer
export const reducer = reducerFactory(initialState);