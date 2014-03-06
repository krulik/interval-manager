Interval Manager
================

A helper class to manage tasks run repeatedly with setInterval.
You can stop the task after some number of conditions has been satisfied, or after an arbitrary number.

Usage example:

```javascript
var im = new IntervalManager({

	// Name for the task
	taskName: taskName,

 	// Time to wait between subsequent tasks
	interval: 100,

 	// Stop after satisfying {Number} of conditions
	conditionsToStop: 2,

 	// Stop after {Number} of runs regardless of satisfied conditions number
	killAfter: 10,

 	// The task to run every interval
	task: function () {
		// Something to do
	},

 	// The condition function, executed each time the task is run
 	// to check whether we need to stop.
	checkCondition: function (taskResult) {
		return taskResult === {some condition};
	},

 	// A function to return unique key for the task
	keyGenerator: function () {
		return {key for the task};
	}
});

im.run(function () {
	// Something to do after stop
});
```
