(function (global, undefined) {

	/**
	 *	Interval Manager.
	 *
	 *	Usage example:
	 *	var im = new IntervalManager({
	 *
	 * 		// Name for the task
	 *		taskName: taskName,
	 *
	 * 		// Time to wait between subsequent tasks
	 *		interval: 100,
	 *
	 * 		// Stop after satisfying {Number} of conditions
	 *		conditionsToStop: 2,
	 *
	 * 		// Stop after {Number} of runs regardless of satisfied conditions number
	 *		killAfter: 10,
	 *
	 * 		// The task to run every interval
	 *		task: function () {
	 *			// Something to do
	 *		},
	 *
	 * 		// The condition function, executed each time the task is run
	 * 		// to check whether we need to stop.
	 *		checkCondition: function (taskResult) {
	 *			return taskResult === {some condition};
	 *		},
	 *
	 * 		// A function to return unique key for the task
	 *		keyGenerator: function () {
	 *			return {key for the task};
	 *		}
	 *	});
	 *
	 *	im.run(function () {
	 *		// Something to do after stop
	 *	});
	 *
	 */
	var IntervalManager = (function (IntervalManager) {

		/**
		 * IntervalManager Constructor.
		 * @param {object} options
		 */
		IntervalManager = function (options) {

			var emptyFunction = function () {};

			// Set configuration
			var taskName = options.taskName || "";
			var interval = options.interval || 100;
			var conditionsToStop = options.conditionsToStop || 1;
			var killAfter = options.killAfter || Number.POSITIVE_INFINITY;
			var task = options.task || emptyFunction;
			var keyGenerator = options.keyGenerator || emptyFunction;
			var checkCondition = options.checkCondition || emptyFunction;

			// Private variables
			var intervalId = null;
			var conditionsCounter = 0;
			var counter = 0;
			var isRunning = false;

			var stop = function (stopCallback) {

				global.clearInterval(intervalId);
				if (typeof(stopCallback) === "function") {
					stopCallback.call(stopCallback);
				}
			};

			// API
			/**
			 * Returns the setInterval ID.
			 * @return {Number}
			 */
			this.getIntervalId = function () {

				return intervalId;
			};

			/**
			 * The function that executes the task.
			 * @param  {Function} stopCallback - Stuff to do after stopping.
			 */
			this.run = function (stopCallback) {

				if (isRunning) {
					return;
				}

				isRunning = true;

				var key = keyGenerator();

				if (global[key]) {
					global.clearInterval(global[key]);
				}

				intervalId = global.setInterval(function () {

					var lastResult = task();

					counter++;

					if (checkCondition(lastResult) === true) {
						conditionsCounter++;
						if (conditionsCounter === conditionsToStop) {
							stop(stopCallback);
						}

					} else if (counter === killAfter) {
						stop(stopCallback);
					}

				}, interval);

				global[key] = intervalId;
			}
		};

		return IntervalManager;

	}(IntervalManager));

	global.IntervalManager = IntervalManager;

}(window));
