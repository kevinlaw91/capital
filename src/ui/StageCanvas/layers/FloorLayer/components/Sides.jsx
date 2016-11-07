import { connect } from "react-redux";
import { selectTiles } from "redux/game/stage/floor";
import { actions as tooltipActions } from "redux/ui/tooltip";
import { getLotId } from "game/map/tile/mappings";
import FloorTile from "./FloorTile";

// Add tooltip support to floor tile
const TooltipFloorTile = connect(null, {
	showTooltip: tooltipActions.show,
	moveTooltip: tooltipActions.move,
	hideTooltip: tooltipActions.hide,
})(FloorTile);

function getIndexFromId(id) {
	return id.match(/\d+$/)[0]|0;
}

const _west = ([id, { ...tileProps }]) => {
	const row = getIndexFromId(id);

	return (
		<TooltipFloorTile
			key={id}
			row={row}
			col={1}
			rowSize={1}
			colSize={3}
			tooltip={getLotId(id)}
			hoverEffect={true}
			{...tileProps}
		/>
	);
};

const _north = ([id, { ...tileProps }]) => {
	const col = getIndexFromId(id);

	return (
		<TooltipFloorTile
			key={id}
			row={1}
			col={col}
			rowSize={3}
			colSize={1}
			tooltip={getLotId(id)}
			hoverEffect={true}
			{...tileProps}
		/>
	);
};

const _south = ([id, { ...tileProps }]) => {
	const col = getIndexFromId(id);

	return (
		<TooltipFloorTile
			key={id}
			row={13}
			col={col}
			rowSize={3}
			colSize={1}
			tooltip={getLotId(id)}
			hoverEffect={true}
			{...tileProps}
		/>
	);
};

const _east = ([id, { ...tileProps }]) => {
	const row = getIndexFromId(id);

	return (
		<TooltipFloorTile
			key={id}
			row={row}
			col={13}
			rowSize={1}
			colSize={3}
			tooltip={getLotId(id)}
			hoverEffect={true}
			{...tileProps}
		/>
	);
};

export const West = connect(
	state => ({ tiles: selectTiles(state, "west") })
)(props => <g>{ Object.entries(props.tiles).map(_west) }</g>);

export const North = connect(
	state => ({ tiles: selectTiles(state, "north") })
)(props => <g>{ Object.entries(props.tiles).map(_north) }</g>);

export const South = connect(
	state => ({ tiles: selectTiles(state, "south") })
)(props => <g>{ Object.entries(props.tiles).map(_south) }</g>);

export const East = connect(
	state => ({ tiles: selectTiles(state, "east") })
)(props => <g>{ Object.entries(props.tiles).map(_east) }</g>);

// Common propType
West.propTypes = North.propTypes = South.propTypes = East.propTypes = {
	tiles: React.PropTypes.objectOf(
		React.PropTypes.shape({
			symbol: React.PropTypes.string,
			variant: React.PropTypes.string,
		})
	)
};