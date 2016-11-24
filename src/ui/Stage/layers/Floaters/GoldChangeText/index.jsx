import { VelocityComponent } from "velocity-react";
import WorldCanvas from "ui/Stage/layers/components/WorldCanvas";
import { getFont } from "game/resources/fonts";

/**
 * Convert text to SVG path (in string)
 * @param text
 * @return {string} String representation of a SVGPathElement
 */
function renderTextAsPath(text) {
	const font = getFont("Passion One");

	// Params
	const fontSize = 16;
	const kerning = true;
	const align = "center";
	const baseline = "middle";

	// Position
	let x = 0, y = 0;

	// Calculate bounding box
	const fontScale = 1 / font.unitsPerEm * fontSize;

	let width = 0;
	const height = (font.ascender + font.descender) * fontScale;

	const glyphs = font.stringToGlyphs(text);
	for (let i = 0, len = glyphs.length; i < len; i++) {
		const glyph = glyphs[i];

		if (glyph.advanceWidth) {
			width += glyph.advanceWidth * fontScale;
		}

		if (kerning && i < len - 1) {
			const kerningValue = font.getKerningValue(glyph, glyphs[i + 1]);
			width += kerningValue * fontScale;
		}
	}

	// Apply horizontal alignment
	switch (align) {
		case "middle":
		case "center":
			x -= width / 2;
			break;
		case "right":
			x -= width;
			break;
	}

	// Apply baseline adjustments
	switch (baseline) {
		case "middle":
		case "center":
			y += height / 2;
			break;
		case "top":
			y += height;
			break;
	}

	// Generate path
	const path = font.getPath(
		text, // Text
		x, // X Position
		y, // Y Position
		fontSize, // Font size
		// Options
		{
			kerning,
		}
	);

	return path.toSVG();
}

/** Random negative or positive */
const randomSign = () => Math.random() < 0.5 ? "-" : "+";

export default class GoldChangeText extends React.Component {
	constructor(props) {
		super(props);

		// Generate path once
		this.textAsPath = renderTextAsPath(this.props.text);

		// Styles
		this.styles = {
			fill: this.props.color,
			stroke: "rgba(0, 0, 0, 0.3)",
			strokeWidth: 0.5,
			opacity: 0,
		};

		// Randomize animation params
		this.lifespan = 4500 + Math.round(Math.random() * 1500);
		const randomDeltaX = Math.round(Math.random() * 50);
		const randomDeltaY = 100 + Math.round(Math.random() * 50);
		this.animateMotionPath = {
			translateX: [`${randomSign()}=${randomDeltaX}`, "ease-out"],
			translateY: [`+=${randomDeltaY}`, [.5, -0.25, .7, .3]],
			scale: [0, [.6, -0.4, .5, .5], 1],
		};

		// Animation complete callback
		this.handleAnimationComplete = () => this.props.removeItem(this.props.id);
	}

	render() {
		return (
			<WorldCanvas
				x={this.props.x}
				y={this.props.y}
			>
				<VelocityComponent
					runOnMount={true}
					animation={{ opacity: [1, "ease-in", 0] }}
					queue={false}
					duration={GoldChangeText.FADE_DURATION}
				>
					<VelocityComponent
						runOnMount={true}
						animation={this.animateMotionPath}
						queue={false}
						duration={this.lifespan}
					>
						<VelocityComponent
							runOnMount={true}
							animation={{ opacity: [0, "ease-out"] }}
							queue={false}
							delay={this.lifespan - GoldChangeText.FADE_DURATION - 1000}
							duration={GoldChangeText.FADE_DURATION}
						    complete={this.handleAnimationComplete}
						>
							<g
								style={this.styles}
								dangerouslySetInnerHTML={{
									__html: this.textAsPath,
								}}
								filter="url(#GoldChangeTextInnerShadow)"
							/>
						</VelocityComponent>
					</VelocityComponent>
				</VelocityComponent>
			</WorldCanvas>
		);
	}
}

GoldChangeText.FADE_DURATION = 1000;

GoldChangeText.propTypes = {
	id: React.PropTypes.string,
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	text: React.PropTypes.string,
	color: React.PropTypes.string,
	removeItem: React.PropTypes.func,
};