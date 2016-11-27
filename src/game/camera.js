import svgPanZoom from "svg-pan-zoom";
import Velocity from "velocity-animate";
import dispatch from "redux/dispatch";
import { actions } from "redux/ui/camera";
import clamp from "js/utils/clamp";
import { getStageInstance } from "game/session/stage";

// Pan Zoom Configurations
const SETTING_ZOOM_MIN = 0.8;
const SETTING_ZOOM_MAX = 3.5;
const SETTING_ZOOM_SENSITIVITY = 0.3;

let camera = null;

// Get instance
export const getCameraInstance = () => camera;

/**
 * Indicates panning mode is active
 * Remember to reset to false every time when panning has finished
 * @type {boolean}
 * @private
 */
let _isPanning = false;
let _mouseDownHolding = false;

// Called after panning
function onAfterPan() {
	dispatch(actions.setPanning(false));
}

// Called when mouse down on svg-pan-zoom svg element
function onMouseDown() {
	dispatch(actions.setGrabbing(true));
	_mouseDownHolding = true;
}

// Called when mouse up on window
function onMouseUp() {
	dispatch(actions.setGrabbing(false));
	if (_isPanning) {
		// This implies panning has stopped
		onAfterPan();
	}

	// Reset internal flags
	_isPanning = false;
	_mouseDownHolding = false;
}

/**
 * Setup camera
 * @return {Promise}
 */
export function init() {
	// Get DOM elements of Stage component
	const {
		svgElement,
		viewportElement,
	} = getStageInstance();

	if (!svgElement || !viewportElement) {
		throw "Unable to hook camera instance to SVG viewport. Element not found.";
	}

	// Initialize svg-pan-zoom instance
	camera = svgPanZoom(svgElement, {
		viewportSelector: viewportElement,
		minZoom: SETTING_ZOOM_MIN,
		maxZoom: SETTING_ZOOM_MAX,
		zoomScaleSensitivity: SETTING_ZOOM_SENSITIVITY,
		beforePan: function (oldPan, newPan) {
			if (_mouseDownHolding) {
				if (!_isPanning) {
					// To prevent dispatch repeatedly
					dispatch(actions.setPanning(true));
				}

				// Disable click event for stage contents when panning
				_isPanning = true;
			}

			// Set Pan boundary
			const { width, height, viewBox, realZoom } = this.getSizes();

			// Calculate freedom of pan movement (x)
			// Distance start from origin (0) and can be -/+
			// -x  <- 0 ->  x
			const horizontalShift = width - (realZoom * viewBox.width);
			const verticalShift = height - (realZoom * viewBox.height);

			// Find min/max of limit
			const horizontalLimits = [0, horizontalShift].sort();
			const verticalLimits = [0, verticalShift].sort();

			return {
				x: clamp(newPan.x, horizontalLimits[0], horizontalLimits[1]),
				y: clamp(newPan.y, verticalLimits[0], verticalLimits[1])
			};
		},
		customEventsHandler: {
			init: function (options) {
				options.svgElement.addEventListener("mousedown", onMouseDown);
			},
			destroy: function (options) {
				options.svgElement.removeEventListener("mousedown", onMouseDown);
			}
		}
	});

	// Cache initial contents and set initial zoom
	camera.updateBBox();
	camera.resize();
	camera.center();

	// Resize svg-pan-zoom viewport
	window.addEventListener("resize", function onWindowResize() {
		camera.resize();
		// Re-apply pan and zoom
		camera.pan(camera.getPan());
		camera.zoom(camera.getZoom());
	});

	// Attach event listener to update panning state
	window.addEventListener("mouseup", onMouseUp);

	return Promise.resolve();
}

export function panToSubject(subject) {
	// Get viewport element of Stage component
	const { viewportElement } = getStageInstance();

	// Get current pan position
	const { x: fromX, y: fromY } = camera.getPan();
	const { width, height, realZoom: zoom } = camera.getSizes();

	// Get subject position
	const subjectX = subject.x.baseVal.value;
	const subjectY = subject.y.baseVal.value;

	// Calculate new pan position
	const toX = -(subjectX * zoom) + (width / 2);
	const toY = -(subjectY * zoom) + (height / 2);

	// Delta
	const dX = toX - fromX;
	const dY = toY - fromY;

	// noinspection JSUnusedGlobalSymbols
	Velocity(viewportElement, {
		tween: 1
	}, {
		queue: false,
		easing: "easeOutExpo",
		duration: 800,
		progress: function (elements, complete, remaining, start, tweenValue) {
			camera.pan({
				x: fromX + (dX * tweenValue),
				y: fromY + (dY * tweenValue)
			});
		},
		complete: function () {
			// Reset internal flag
			_isPanning = false;
		}
	});
}
