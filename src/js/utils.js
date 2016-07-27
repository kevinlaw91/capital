define(function() {
	"use strict";

	/** @module utils */
	return {
		clamp: function(value, min, max) {
			/**
			 * Returns a number whose value is limited to the given range.
			 *
			 * Example: limit the output of this computation to between 0 and 255
			 * (x * 255).clamp(0, 255)
			 *
			 * @param {number} min The lower boundary of the output range
			 * @param {number} max The upper boundary of the output range
			 * @returns {number} A number in the range [min, max]
			 */
			return Math.min(Math.max(value, min), max);
		},

		/**
		 * Format a number as currency
		 * @example
		 * formatAsCurrency(-12345); // Returns "-$12,345"
		 */
		formatAsCurrency: (function() {
			// Define currency formatting
			var f = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				useGrouping: true,
				// Remove fractions
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});

			return f.format;
		})(),

		/**
		 *  minifyJSON()
		 *
		 *  Adapted from JSON.minify
		 *  v0.1 (c) Kyle Simpson
		 *  GitHub: https://github.com/getify/JSON.minify/
		 *  Released under MIT License
		 *
		 *  Purpose
		 *  =======
		 *  Minifies blocks of JSON-like content into valid JSON by removing all whitespace and JS-style comments.
		 *  Useful to sterilize JSON configuration files with comments
		 *
		 *  Usage
		 *  =====
		 *  Pipe JSON string through minifyJSON() before handing it to JSON parser, e.g.:
		 *
		 *  JSON.parse(minifyJSON(str))
		 */
		minifyJSON: function(json) {
			/* eslint-disable */
			var tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r/g,
				in_string = false,
				in_multiline_comment = false,
				in_singleline_comment = false,
				tmp, tmp2, new_str = [], ns = 0, from = 0, lc, rc;

			tokenizer.lastIndex = 0;

			while (tmp = tokenizer.exec(json)) {
				lc = RegExp.leftContext;
				rc = RegExp.rightContext;
				if (!in_multiline_comment && !in_singleline_comment) {
					tmp2 = lc.substring(from);
					if (!in_string) {
						tmp2 = tmp2.replace(/(\n|\r|\s)*/g,"");
					}
					new_str[ns++] = tmp2;
				}
				from = tokenizer.lastIndex;

				if (tmp[0] == "\"" && !in_multiline_comment && !in_singleline_comment) {
					tmp2 = lc.match(/(\\)*$/);
					if (!in_string || !tmp2 || (tmp2[0].length % 2) === 0) {	// start of string with ", or unescaped " character found to end string
						in_string = !in_string;
					}
					from--; // include " character in next catch
					rc = json.substring(from);
				} else if (tmp[0] == "/*" && !in_string && !in_multiline_comment && !in_singleline_comment) {
					in_multiline_comment = true;
				} else if (tmp[0] == "*/" && !in_string && in_multiline_comment && !in_singleline_comment) {
					in_multiline_comment = false;
				} else if (tmp[0] == "//" && !in_string && !in_multiline_comment && !in_singleline_comment) {
					in_singleline_comment = true;
				} else if ((tmp[0] == "\n" || tmp[0] == "\r") && !in_string && !in_multiline_comment && in_singleline_comment) {
					in_singleline_comment = false;
				} else if (!in_multiline_comment && !in_singleline_comment && !(/\n|\r|\s/.test(tmp[0]))) {
					new_str[ns++] = tmp[0];
				}
			}
			new_str[ns] = rc;
			return new_str.join("");
			/* eslint-enable */
		}
	};
});