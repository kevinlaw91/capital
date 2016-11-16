import { VelocityComponent } from "velocity-react";
import { connect } from "react-redux";
import Deferred from "js/utils/deferred";
import { token as animation } from "game/config/animations";
import { default as sprite } from "game/resources/sprites/tokens";
import { actions as tooltipActions } from "redux/ui/tooltip";
import { register, unregister } from "ui/tokens";

class Token extends React.Component {
	constructor(props) {
		super(props);
		this._animation = {};
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.onAnimationComplete = this.onAnimationComplete.bind(this);
		this.handleAnimationComplete = this.handleAnimationComplete.bind(this);
	}

	componentDidMount() {
		register(this.props.tokenId, this);
	}

	componentWillUnmount() {
		unregister(this.props.tokenId);
	}

	handleMouseEnter(evt) {
		// Show tooltip
		this.props.showTooltip("TokenTooltip", this.props.tokenId);
	}

	handleMouseMove(evt) {
		// Move tooltip
		const { left, top, width, height } = evt.target.getBoundingClientRect();
		this.props.moveTooltip(left + (width / 2), top + (height / 2));
	}

	handleMouseOut() {
		this.props.hideTooltip();
	}

	onAnimationComplete() {
		if (!this._animation.onComplete) {
			this._animation.onComplete = new Deferred();
		}

		return this._animation.onComplete.promise;
	}

	handleAnimationComplete() {
		if (this._animation.onComplete) {
			this._animation.onComplete.resolve();
			delete this._animation.onComplete;
		}
	}

	render() {
		const animatedProps = {
			x: this.props.x + Token.OFFSET_X,
			y: this.props.y + Token.OFFSET_Y,
		};

		return (
			<VelocityComponent
				animation={animatedProps}
				duration={animation.DURATION_MOVE}
				complete={this.handleAnimationComplete}
			>
				<use
					width={64}
					height={64}
					xlinkHref={ sprite(this.props.color) }
					style={{
						"cursor": "default",
						"shapeRendering": "crispEdges",
					}}
					onMouseEnter={this.handleMouseEnter}
					onMouseMove={this.handleMouseMove}
					onMouseOut={this.handleMouseOut}
				/>
			</VelocityComponent>
		);
	}
}

// Offset to be applied to the sprite
Token.OFFSET_X = -32;
Token.OFFSET_Y = -43;

Token.propTypes = {
	tokenId: React.PropTypes.string.isRequired,
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	color: React.PropTypes.string,
	showTooltip: React.PropTypes.func,
	moveTooltip: React.PropTypes.func,
	hideTooltip: React.PropTypes.func,
};

Token.defaultProps = {
	color: "white",
	x: 0,
	y: 0,
};

export default connect(null, {
	showTooltip: tooltipActions.show,
	moveTooltip: tooltipActions.move,
	hideTooltip: tooltipActions.hide,
})(Token);