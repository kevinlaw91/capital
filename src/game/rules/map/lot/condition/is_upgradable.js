import getNextUpgrade from "game/rules/map/lot/getNextUpgrade";

/** @return {number|undefined} A number if upgrade is available or undefined if upgrade is not possible */
export default location => (typeof getNextUpgrade(location) === "number");
