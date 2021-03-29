const functionalTest = require('./functional');
const imperativeTest = require('./imperative');
const losslessTest = require('./lossless');

const { PerformanceObserver, performance } = require('perf_hooks');

const a = Array(100000).fill(0).map((e, i) => i)
const iterations = 10000;

const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0]);
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

////////////////////////////////
/// Functional
performance.mark('Functional');

let functionalResult;

for(let i = 0; i < iterations; i++) {
    functionalResult = functionalTest(a);
}

performance.measure('Functional', 'Functional');
performance.clearMarks('Functional')

///////////////////////////////
/// Lossless
performance.mark('Lossless');

let losslessResult;

for(let i = 0; i < iterations; i++) {
    losslessResult = losslessTest(a);
}

performance.measure('Lossless', 'Lossless');
performance.clearMarks('Lossless')

///////////////////////////////
/// Imperative
performance.mark('Imperative');

let imperativeResult;

for(let i = 0; i < iterations; i++) {
    imperativeResult = imperativeTest(a);
}

performance.measure('Imperative', 'Imperative');
performance.clearMarks('Imperative')

// console.log('END:', !!(functionalResult || losslessResult || imperativeResult));
// console.log(functionalResult, losslessResult, imperativeResult);

const functionalJSON = JSON.stringify(functionalResult);
const losslessJSON = JSON.stringify(losslessResult);
const imperativeJSON = JSON.stringify(imperativeResult);
console.log('All equal', functionalJSON === losslessJSON && losslessJSON === imperativeJSON);
