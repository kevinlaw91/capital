define([
	"snapsvg",
	"svg-pan-zoom",
	"jquery",
	"jquery.easing",
	"ui/stage",
	"engine/config"
], function(Snap, svgPanZoom, $) {
	'use strict';

	var Camera = {
		/** Flag to determine if camera is currently panning */
		isPanning: false,

		/** Flag to determine camera was panned through last mouse release event */
	    panned: false,

		/** Resets the pan status flags */
		panCompleted: function(){
			// Reset flags
			// Use every time after triggering pan action by code
			// to prevent click not registering
			Camera.isPanning = false;
			Camera.panned = false;
		}
	};

	var controller, padding;

	/** Set up camera on stage */
	Camera.setup = function() {
		var Config = require("engine/config"),
		    Stage = require("ui/stage"),
		    Utils = require("utils");

		// Add a <g> element
		var canvas = Stage.container.g().attr({
			"id": Config.getAsId("canvas.id")
		});

		// Store reference to UI Module
		Stage.canvas = canvas;

		// Create dummy scene for SVGPanZoom
		var _DummyScene = canvas.rect(0,0,1024,768).attr({
			"opacity": "0",
			"class": "no-pointer-events"
		});

		// Method to remove the dummy object after first render
		Camera.removeDummyScene = function(){
			_DummyScene.remove();
			_DummyScene = null;
			delete Camera.removeDummyScene;
		};

		/*
		 * Padding config is a float between 0 - 1
		 * If config = 0.4, at least 40% of the original contents will be visible
		 */
		padding = 1 - Config.get("camera.pan.padding");

		/*
		 * Controller
		 */
		controller = svgPanZoom(Config.get("canvas.svg"), {
			viewportSelector: Config.get("canvas.id"),
			minZoom: Config.get("camera.zoom.min"),
			maxZoom: Config.get("camera.zoom.max"),
			zoomScaleSensitivity: Config.get("camera.zoom.sensitivity"),
			beforePan: function( oldPan, newPan ) {
				// Flag to disable child click event
				Camera.isPanning = true;

				// Set Pan boundary
				var sizes  = this.getSizes(),
				    vb = sizes.viewBox,
				    rZ = sizes.realZoom,
				    wrZ = vb.width * rZ,
				    hrZ = vb.height * rZ,
				    zW = wrZ * padding,
				    zH = hrZ * padding,

			        leftLimit    = vb.x - zW,
			        rightLimit   = sizes.width - wrZ + zW,
			        topLimit     = vb.y - zH,
			        bottomLimit  = sizes.height - hrZ + zH;

				return {
					x: Utils.clamp(newPan.x, leftLimit, rightLimit),
					y: Utils.clamp(newPan.y, topLimit, bottomLimit)
				};
			},

			customEventsHandler: {
				init: function( options ) {
					this.listeners = {
						mouseup: function() {
							Camera.panned    = !!Camera.isPanning;
							Camera.isPanning = false;
						}
					};

					for(var eventName in this.listeners) {
						if(this.listeners.hasOwnProperty(eventName)){
							options.svgElement.addEventListener(eventName, this.listeners[eventName], false);
						}
					}
				},
				destroy: function( options ) {
					for(var eventName in this.listeners) {
						if(this.listeners.hasOwnProperty(eventName)){
							options.svgElement.removeEventListener(eventName, this.listeners[eventName]);
						}
					}
				}
			}
		});

		// Set initial zoom
		controller.zoom(Config.get("camera.zoom.initial"));

		// Expose API methods to module
		Camera.updateBBox = controller.updateBBox;
		Camera.center = controller.center;
		Camera.resize =	controller.resize;

		// Setup can only run for once
		delete Camera.setup;
	};

	/**
	 * Pan camera to focus on subject
	 * @param el - Subject element
	 */
	Camera.panToSubject = function(el) {
		var from = controller.getPan(),
			sizes = controller.getSizes(),
			halfWidth = sizes.width / 2,
			halfHeight = sizes.height / 2,
		    zoom = sizes.realZoom,
		    eX = Number(el.attr("x")) * zoom,
		    eY = Number(el.attr("y")) * zoom;

		$({}).animate({ now: '+=1' }, {
			duration: 800,
			easing: 'easeOutExpo',
			step: function(now) {
				var toX = -eX + halfWidth,
					toY = -eY + halfHeight;

				controller.pan({
					x: from.x + ((toX - from.x) * now),
					y: from.y + ((toY - from.y) * now)
				});
			},
			complete: function() {
				Camera.panCompleted();
			}
		});
	};

	/*
	 * Patch SnapSVG click event handler
	 * so that it doesn't fires when camera is panning
	 */
	Snap.plugin(function(Snap, Element) {
		var oClick = Element.prototype.click;

		// Inject panning condition check to every function passed to Snap .click()
		Element.prototype.click = function(fn) {
			fn = fn_new(fn);
			oClick.call(this, fn);
		};

		// Wrap old function with panning condition check
		function fn_new( callable ) {
			return function() {
				if(!Camera.panned) { callable.call(this); }
				Camera.panned = false;
			};
		}
	});

	return Camera;
});