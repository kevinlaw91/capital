export default function SVGFilterBrightness(props) {
	return (
		<filter id={props.id}>
			<feComponentTransfer>
				<feFuncR type="linear" slope={props.value} />
				<feFuncG type="linear" slope={props.value} />
				<feFuncB type="linear" slope={props.value} />
			</feComponentTransfer>
		</filter>
	);
}

SVGFilterBrightness.propTypes = {
	id: React.PropTypes.string,
	value: React.PropTypes.string,
};