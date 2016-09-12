import svgPanZoom from "svg-pan-zoom";
import clamp from "../utils/clamp";
import Velocity from "velocity-animate";

// Pan Zoom Configurations
const SETTING_ZOOM_INITIAL = 2.0;
const SETTING_ZOOM_MIN = 0.8;
const SETTING_ZOOM_MAX = 3.5;
const SETTING_ZOOM_SENSITIVITY = 0.3;

/** @public */
let camera = null;
export default camera;

/**
 * Indicates panning mode is active
 * Remember to reset to false every time when panning has finished
 * @type {boolean}
 * @private
 */
let _isPanning = false;

/**
 * Viewport element of svg-pan-zoom
 * @type {SVGGElement|null}
 * @private
 */
let viewport = null;

export function setup(svgElement, viewportElement) {
	// Called after panning
	function onAfterPan() {}

	// Called when mouse up on svg-pan-zoom svg element
	function onMouseUp() {
		// Mouseup was fired during panning
		if (_isPanning) {
			// Panning will stop when mouseup
			onAfterPan();
			// Reset internal flags
			_isPanning = false;
		}
	}

	// Initialize svg-pan-zoom instance
	camera = svgPanZoom(svgElement, {
		viewportSelector: viewportElement,
		minZoom: SETTING_ZOOM_MIN,
		maxZoom: SETTING_ZOOM_MAX,
		zoomScaleSensitivity: SETTING_ZOOM_SENSITIVITY,
		beforePan: function (oldPan, newPan) {
			// Disable click event for stage contents when panning
			_isPanning = true;

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
				options.svgElement.addEventListener("mouseup", onMouseUp);
			},
			destroy: function (options) {
				options.svgElement.removeEventListener("mouseup", onMouseUp);
			}
		}
	});

	// Cache viewport element
	viewport = viewportElement;

	// Cache initial contents and set initial zoom
	camera.updateBBox();
	camera.resize();
	camera.zoom(SETTING_ZOOM_INITIAL);

	// Resize svg-pan-zoom viewport
	window.addEventListener("resize", function onWindowResize() {
		camera.resize();
		// Re-apply pan and zoom
		camera.pan(camera.getPan());
		camera.zoom(camera.getZoom());
	});
}

export function panToSubject(subject) {
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

	Velocity(viewport, {
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