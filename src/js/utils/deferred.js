/** @constructor */
export default function Deferred() {
	/**
	 * Promise of the deferred
	 * @member {Promise}
	 */
	this.promise = new Promise((resolve, reject) => {
		/**
		 * Resolves the deferred.
		 * @method
		 */
		this.resolve = resolve;
		/**
		 * Rejects the deferred.
		 * @method
		 */
		this.reject = reject;
	});

	return this;
}