// Adapted from String.prototype.padStart
// https://github.com/tc39/proposal-string-pad-start-end

/** @return {number} */
const ToLength = argument => {
	const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
	const len = Number(argument);

	if (Number.isNaN(len) || len <= 0) { return 0; }
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }

	return len;
};

export default function padStart(strObj, maxLength, fillString = " ") {
	if (strObj === null || typeof strObj === "undefined") {
		throw new TypeError("strObj must not be null or undefined");
	}

	const S = String(strObj);

	const intMaxLength = ToLength(maxLength);
	const stringLength = ToLength(S.length);

	if (intMaxLength <= stringLength) { return S; }

	let filler = typeof fillString === "undefined" ? " " : String(fillString);
	if (filler === "") { return S; }

	const fillLen = intMaxLength - stringLength;

	while (filler.length < fillLen) {
		const fLen = filler.length;
		const remainingCodeUnits = fillLen - fLen;

		if (fLen > remainingCodeUnits) {
			filler += filler.slice(0, remainingCodeUnits);
		} else {
			filler += filler;
		}
	}

	const truncatedStringFiller = filler.slice(0, fillLen);

	return truncatedStringFiller + S;
}