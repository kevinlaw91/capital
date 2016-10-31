import { connect } from "react-redux";

import FloorTile from "./FloorTile";

import { selectTiles } from "../../../../../redux/game/stage/floor";

export const Top = connect(
	state => selectTiles(state, "corners")["TILE-CORNER-TOP"]
)(props => <FloorTile col={1} row={1} rowSize={3} colSize={3} {...props} />);

export const Left = connect(
	state => selectTiles(state, "corners")["TILE-CORNER-LEFT"]
)(props => <FloorTile col={1} row={13} rowSize={3} colSize={3} {...props} />);

export const Bottom = connect(
	state => selectTiles(state, "corners")["TILE-CORNER-BOTTOM"]
)(props => <FloorTile col={13} row={13} rowSize={3} colSize={3} {...props} />);

export const Right = connect(
	state => selectTiles(state, "corners")["TILE-CORNER-RIGHT"]
)(props => <FloorTile col={13} row={1} rowSize={3} colSize={3} {...props} />);
