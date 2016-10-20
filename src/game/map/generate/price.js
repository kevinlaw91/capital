import gRandom from "./utils/gaussianRandom";
import round100 from "./utils/round100";

const PRICE_MIN = 300; // Minimum price of a property lot
const PRICE_AVG = 1800; // Average price of a property lot
const PRICE_MAX = 3000; // Maximum price of a property lot

export default () => round100(gRandom(PRICE_MIN, PRICE_AVG, PRICE_MAX));