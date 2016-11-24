import { VelocityComponent } from "velocity-react";
import { connect } from "react-redux";
import classnames from "classnames";
import Deferred from "js/utils/deferred";
import { token as animation } from "game/config/animations";
import { default as sprite } from "game/resources/sprites/tokens";
import { actions as tooltipActions } from "redux/ui/tooltip";
import styles from "./Token.scss";

const tokenStyles = classnames(
	styles["crisp"],
	styles["cursor-default"]
);

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
		this.props.register(this.props.tokenId, this);
	}

	componentWillUnmount() {
		this.props.unregister(this.props.tokenId);
	}

	handleMouseEnter() {
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
		return (
			<VelocityComponent
				animation={{
					x: this.props.x + Token.OFFSET_X,
					y: this.props.y + Token.OFFSET_Y,
				}}
				duration={animation.DURATION_MOVE}
				complete={this.handleAnimationComplete}
			>
				<use
					width={64}
					height={64}
					xlinkHref={sprite(this.props.color)}
					className={tokenStyles}
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
	register: React.PropTypes.func,
	unregister: React.PropTypes.func,
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

const mapDispatchToProps = {
	showTooltip: tooltipActions.show,
	moveTooltip: tooltipActions.move,
	hideTooltip: tooltipActions.hide,
};

export default connect(null, mapDispatchToProps)(Token);