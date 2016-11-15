import { connect } from "react-redux";
import FloorTile from "./FloorTile";
import { selectTiles } from "redux/game/stage/floor";
import styles from "./styles.scss";

// Use empty object to prevent injection of dispatch prop
const mapDispatchToProps = {};

// Common props for all corner tiles
const commonProps = {
	colSize: 3,
	rowSize: 3,
	className: styles["action-tile"],
};

export const Top = connect(
	state => {
		const {	symbol,	variant } = selectTiles(state, "corners")["TILE-CORNER-TOP"];

		return {
			...commonProps,
			symbol,
			variant,
			col: 1,
			row: 1,
		};
	},
	mapDispatchToProps
)(FloorTile);

export const Left = connect(
	state => {
		const {	symbol,	variant } = selectTiles(state, "corners")["TILE-CORNER-LEFT"];

		return {
			...commonProps,
			symbol,
			variant,
			col: 1,
			row: 13,
		};
	},
	mapDispatchToProps
)(FloorTile);

export const Bottom = connect(
	state => {
		const {	symbol,	variant } = selectTiles(state, "corners")["TILE-CORNER-BOTTOM"];

		return {
			...commonProps,
			symbol,
			variant,
			col: 13,
			row: 13,
		};
	},
	mapDispatchToProps
)(FloorTile);

export const Right = connect(
	state => {
		const {	symbol,	variant } = selectTiles(state, "corners")["TILE-CORNER-RIGHT"];

		return {
			...commonProps,
			symbol,
			variant,
			col: 13,
			row: 1,
		};
	},
	mapDispatchToProps
)(FloorTile);
