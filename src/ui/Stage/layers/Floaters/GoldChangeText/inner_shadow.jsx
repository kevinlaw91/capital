export default (
	<filter id="GoldChangeTextInnerShadow" x="-50%" y="-50%" width="200%" height="200%">
		<feComponentTransfer in="SourceAlpha">
			<feFuncA type="table" tableValues="1 0" />
		</feComponentTransfer>
		<feGaussianBlur stdDeviation="2" />
		<feMorphology operator="dilate" radius="1" result="blur" />
		<feFlood floodColor="rgba(0, 0, 0, 0.75)" result="color" />
		<feComposite in2="blur" operator="in" />
		<feComposite in2="SourceAlpha" operator="in" />
		<feMerge>
			<feMergeNode in="SourceGraphic" />
			<feMergeNode />
		</feMerge>
	</filter>
);