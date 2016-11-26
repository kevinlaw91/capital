/** Get rent by current tier */
export default resolvedLocation => resolvedLocation.rent[resolvedLocation.tier || 0];
