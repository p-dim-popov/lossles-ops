const { PerformanceObserver, performance } = require('perf_hooks');
const functionalTest = require('./functional');
const imperativeTest = require('./imperative');
const lossless = require('./lossless').tests;

const obs = new PerformanceObserver((items) => {
  for (const entry of items.getEntries()) {
    console.log(`${entry.name},${entry.duration}`);
  }
});
obs.observe({ entryTypes: ['function'], buffered: true });

const functionsToBenchmark = [functionalTest, imperativeTest, ...lossless]
  .map(performance.timerify);
const results = [];

const a = Array(100000).fill(0).map((e, i) => i);
const iterations = 10000;

for (let i = 0; i < iterations; i++) {
  let result;
  for (const benchmark of functionsToBenchmark) {
    result = benchmark(a);
    console.warn(benchmark.name);
  }
  if (i % iterations === 0 && global.gc) {
    global.gc();
    results.push(result);
  }
}

console.error('All equal', results.every((result) => JSON.stringify(result) === JSON.stringify(results[0])));
