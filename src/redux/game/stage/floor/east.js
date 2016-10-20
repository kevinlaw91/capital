import Immutable from "seamless-immutable";

import { reducerFactory } from "./sideReducerFactory";

const tileDefault = Immutable({
	symbol: "lot-east",
	variant: "01",
});

// Initial state
const initialState = Immutable({
	"TILE-EAST-4": tileDefault,
	"TILE-EAST-5": tileDefault,
	"TILE-EAST-6": tileDefault,
	"TILE-EAST-7": tileDefault,
	"TILE-EAST-8": tileDefault,
	"TILE-EAST-9": tileDefault,
	"TILE-EAST-10": tileDefault,
	"TILE-EAST-11": tileDefault,
	"TILE-EAST-12": tileDefault,
});


// Reducer
export const reducer = reducerFactory(initialState);