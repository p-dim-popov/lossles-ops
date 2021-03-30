const functionalTest = require('./functional');
const imperativeTest = require('./imperative');
const losslessTest = require('./lossless');

const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
    for (const entry of items.getEntries()) {
        console.log(`${entry.name},${entry.duration}`)
    }
});
obs.observe({ entryTypes: ['function'], buffered: true });

let functionsToBenchmark = [functionalTest, imperativeTest, losslessTest]
    .map(performance.timerify)
let results = []

const a = Array(1000000).fill(0).map((e, i) => i)
const iterations = 100000;
for (const benchmark of functionsToBenchmark) {
    let result
    for (let i = 0; i < iterations; i++) {
        result = benchmark(a);
    }
    if(global.gc) {
        global.gc()
    }
    results.push(result)
   
}

console.error('All equal', results.every(result => JSON.stringify(result) === JSON.stringify(results[0])))