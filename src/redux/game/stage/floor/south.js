import Immutable from "seamless-immutable";
import { reducerFactory } from "./sideReducerFactory";

const tileDefault = Immutable({
	symbol: "lot-south",
	variant: "01",
});

// Initial state
const initialState = Immutable({
	"TILE-SOUTH-4": tileDefault,
	"TILE-SOUTH-5": tileDefault,
	"TILE-SOUTH-6": tileDefault,
	"TILE-SOUTH-7": tileDefault,
	"TILE-SOUTH-8": tileDefault,
	"TILE-SOUTH-9": tileDefault,
	"TILE-SOUTH-10": tileDefault,
	"TILE-SOUTH-11": tileDefault,
	"TILE-SOUTH-12": tileDefault,
});


// Reducer
export const reducer = reducerFactory(initialState);