import { VelocityComponent } from "velocity-react";
import WorldCanvas from "ui/Stage/layers/components/WorldCanvas";
import { getFont } from "game/resources/fonts";
import { removeFloaterById } from "ui/Stage/controllers/floater";

/**
 * Convert text to SVG path (in string)
 * @param text
 * @return {string} String representation of a SVGPathElement
 */
function renderTextAsPath(text) {
	const font = getFont("Passion One");
	const path = font.getPath(
		text, // Text
		0, // X Position
		0, // Y Position
		16, // Font size
		// Options
		{
			kerning: true,
		}
	);

	return path.toSVG();
}

/** Random negative or positive */
const randomSign = () => Math.random() < 0.5 ? "-" : "+";

export default class GoldChangeText extends React.Component {
	constructor(props) {
		super(props);

		// Bind
		this.setBBoxRef = this.setBBoxRef.bind(this);
		this.setMotionPathAnim = this.setMotionPathAnim.bind(this);
		this.setFadeInAnim = this.setFadeInAnim.bind(this);
		this.setFadeOutAnim = this.setFadeOutAnim.bind(this);

		// Calculate path once
		this.textAsPath = renderTextAsPath(this.props.text);

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
		this.callbackComplete = () => removeFloaterById(this.props.id);

		// Prevent re-trigger of animation
		this.animationStarted = false;

		this.state = {
			// Offset to be applied to align rendered path to center
			xOffset: 0,
		};
	}

	setBBoxRef(ref) {
		this.BBoxRef = ref;
	}

	setMotionPathAnim(ref) {
		this.MotionPathAnim = ref;
	}
	setFadeInAnim(ref) {
		this.FadeInAnim = ref;
	}
	setFadeOutAnim(ref) {
		this.FadeOutAnim = ref;
	}

	componentDidMount() {
		// Align center
		this.setState({
			xOffset: -this.BBoxRef.getBoundingClientRect().width / 2
		});

		// Start animation after align
		this.MotionPathAnim.runAnimation();
		this.FadeInAnim.runAnimation();
		this.FadeOutAnim.runAnimation();
	}

	render() {
		return (
			<WorldCanvas
				x={this.props.x}
				y={this.props.y}
			>
				<g transform={`translate(${this.state.xOffset}, 0)`}>
					<VelocityComponent
						ref={this.setFadeInAnim}
						animation={{ opacity: [1, "ease-in", 0] }}
						queue={false}
						duration={GoldChangeText.FADE_DURATION}
					>
						<VelocityComponent
							ref={this.setMotionPathAnim}
							animation={this.animateMotionPath}
							queue={false}
							duration={this.lifespan}
						>
							<VelocityComponent
								ref={this.setFadeOutAnim}
								animation={{ opacity: [0, "ease-out"] }}
								queue={false}
								delay={this.lifespan - GoldChangeText.FADE_DURATION - 1000}
								duration={GoldChangeText.FADE_DURATION}
							    complete={this.callbackComplete}
							>
								<g
									ref={this.setBBoxRef}
									style={{
										fill: this.props.color,
										stroke: "rgba(0, 0, 0, 0.3)",
										strokeWidth: 0.5,
										opacity: 0,
									}}
									dangerouslySetInnerHTML={{
										__html: this.textAsPath,
									}}
									filter="url(#GoldChangeTextInnerShadow)"
								/>
							</VelocityComponent>
						</VelocityComponent>
					</VelocityComponent>
				</g>
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
};