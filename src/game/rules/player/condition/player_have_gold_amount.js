/**
 * @param {object} player - Resolved player
 * @param {number} gold - Gold amount
 * @return {boolean}
 */
export default (player, gold) => (player.gold >= gold);