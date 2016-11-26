/** Get rent by current tier */
export default location => location.rent[location.tier || 0];
