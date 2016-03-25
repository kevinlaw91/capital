define([
	"jquery",
	"jquery.pub-sub",
	"engine/config",
	"render/sprite/token",
    "engine/transform",
	"render/sprite/marker",
	"engine/core"
], function($) {
	var Config = require("engine/config");
	var ScreenTransform = require("engine/transform");
	var PlayerToken = require("render/sprite/token");
	var GroundMarker = require("render/sprite/marker");

	var markColors = {
		"RED": "#BF4D4F",
		"BLUE": "#2DB1B1"
	};

	/**
	 * @constructor
	 */
	function Player(name, color){
		/**
		 * Player name
		 * @type {string}
		 */
		this.name = name;
		/**
		 * Player color
		 * @type {string}
		 */
		this.color = color;

		/**
		 * Player color
		 * @type {string}
		 */
		this.markColor = markColors[color];

		/** Current position of player */
		this.position = {
			/** Current map grid (column) position of player */
			mapX: 0,
			/** Current map grid (row) position of player */
			mapY: 0,
			/** Index in map array */
			index: 0,
			/** Lot instance in map array */
			lot: null
		};

		//Pending steps
		this.pendingSteps = 0;

		/**
		 * Amount of cash player possesses
		 * @member {number}
		 */
		this.cash = 0;

		//Create view
		this.token = new PlayerToken(color);

		//Create marker
		this.marker = new GroundMarker();

		//Set as inactive
		this.hideActiveMarker();
	}

	/**
	 * Adds an amount of cash to player
	 * @param {number} amount
	 */
	Player.prototype.addCash = function(amount) {
		this.cash += amount;
	};

	/**
	 * Deducts an amount of cash from player
	 * @param {number} amount
	 */
	Player.prototype.deductCash = function(amount) {
		this.cash -= amount;
	};

	/**
	 * Attempt to buy a land lot
	 * @param {Lot} [lot] - Target lot to be bought, use current position if unspecified
	 * @return {boolean} True - if success
	 */
	Player.prototype.buy = function(lot) {
		if(!lot){
			lot = this.position.lot;
		}

		if(lot.owner === null && lot.isTradable){
			lot.sellTo(this);
			$.publish("PropertyTransfer", { lot: lot, player: this });
			return true;
		}else{
			return false;
		}
	};

	/**
	 * Attempt to upgrade current lot
	 * @return {boolean} True - if success
	 */
	Player.prototype.upgrade = function() {
		var lot = this.position.lot;

		// Fail if
		// - Player not standing on a lot
		// - Player do not own the property
		if(lot && lot.isOwnedBy(this) && lot.upgradeAvailable()){
			lot.upgrade();
			$.publish("PropertyUpgrade", { lot: lot, player: this });
			return true;
		}
		return false;
	};

	/**
	 * Move player to x, y position in map
	 * @param {number} x Position in column (x)
	 * @param {number} y Position in row (y)
	 * @param {boolean} [animate=false] Directly jump to destination?
	 */
	Player.prototype.moveTo = function(x, y, animate){
		// Update position
		this.position.mapX = x;
		this.position.mapY = y;

		// Get client screen offset
		// uses (y,x) is not a bug
		var pos = ScreenTransform.getTopFaceMidpoint(y,x);

		// Move ground marker
		this.marker.moveTo(pos.x, pos.y);

		//Generate callback based on player's context
		var reached = (function(oPlayer){
			return function(){
				$.publish("PlayerMove", {player: oPlayer, x: x, y: y});
			};
		})(this);

		// Move token
		if(animate) {
			this.token.moveTo(pos.x, pos.y, true, reached);
		} else {
			this.token.moveTo(pos.x, pos.y, false, reached);
		}
	};

	/**
	 * Moves player by specified number of steps
	 * @param {number} [numOfSteps]
	 * If specified, will moves player by the step count.
	 * Function will recursively call itself with no argument until movement finishes.
	 */
	Player.prototype.moveBySteps = function(numOfSteps) {
		if(typeof numOfSteps != "undefined"){
			this.pendingSteps = numOfSteps;
		}

		$.publish("MovePlayerForward", {player: this});

		this.pendingSteps--;
		if(this.pendingSteps>0){
			//Not yet reach destination
			setTimeout(
				(function(player){
					return function(){
						player.moveBySteps();
					};
				})(this),
				Config.get("player.token.waitTime"));
		} else {
			//Reach destination
			setTimeout(
				(function(p){
					return function(){
						$.publish("PlayerStopped", { player: p });
					};
				})(this),
				Config.get("player.token.waitTime"));
		}
	};

	Player.prototype.bringToFront = function() {
		this.token.bringToFront();
	};

	Player.prototype.showActiveMarker = function(){
		this.marker.show();
	};

	Player.prototype.hideActiveMarker = function(){
		this.marker.hide();
	};

	return Player;
});