import { connect } from "react-redux";
import {
	templates as t,
	selectAllByTemplate,
} from "redux/game/stage/floaters";
import GoldChangeText from "./template";

const mapStateToProps = state => ({
	items: selectAllByTemplate(state, t.GOLD_CHANGE_TEXT),
});

export default connect(mapStateToProps)(props => {
	return (
		<g>
			{ Object.entries(props.items).map(([id, i]) =>
				<GoldChangeText
					key={id}
					id={id}
					x={i.x}
					y={i.y}
					text={i.text}
					color={i.color}
				/>
			)}
		</g>
	);
});