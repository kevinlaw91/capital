export default (location, player) =>
	location.owner &&
	location.owner === player.id;
