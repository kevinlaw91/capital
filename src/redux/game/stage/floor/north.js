import Immutable from "seamless-immutable";

import { reducerFactory } from "./sideReducerFactory";

const tileDefault = Immutable({
	symbol: "lot-north",
	variant: "01",
});

// Initial state
const initialState = Immutable({
	"TILE-NORTH-4": tileDefault,
	"TILE-NORTH-5": tileDefault,
	"TILE-NORTH-6": tileDefault,
	"TILE-NORTH-7": tileDefault,
	"TILE-NORTH-8": tileDefault,
	"TILE-NORTH-9": tileDefault,
	"TILE-NORTH-10": tileDefault,
	"TILE-NORTH-11": tileDefault,
	"TILE-NORTH-12": tileDefault,
});


// Reducer
export const reducer = reducerFactory(initialState);