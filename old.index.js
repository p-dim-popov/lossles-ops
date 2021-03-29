const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0]);
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

let a = Array(100000).fill(0).map((e, i) => i)

class Lossless {
    #array = []
    ops = []
    constructor(array) {
        this.#array = array
    }

    map(fn) {
        this.ops.push(["map", fn])
        return this
    }

    filter(fn) {
        this.ops.push(["filter", fn])
        return this
    }

    get() {
        let result = []
        outer: for (const el of this.#array) {
            let mod = el
            for (const op of this.ops) {
                switch (op[0]) {
                    case "map":
                        mod = op[1](mod)
                        break
                    case "filter":
                        if (op[1](mod) === false) {
                            continue outer;
                        }
                        break
                }
            }
            result.push(mod)
        }
        return result
    }
}

const filter1 = e => e % 80 === 0;
const map1 = e => Math.sin(e);
const filter2 = e => e > 0;

function functionalTest(arr) {
    return arr
        .filter(e => e % 80 === 0)
        .map(e => Math.sin(e))
        .filter(e => e > 0)
}

function losslessTest(arr) {
    return arr
        .filter(e => e % 80 === 0)
        .map(e => Math.sin(e))
        .filter(e => e > 0)
        .get()
}

function imperativeTest(arr) {
    let result = []
    let idx = 0
    for(const el of arr) {
        if(el % 80 === 0) {
            continue
        }
        const r = Math.sin(el)
        if(r > 0) {
            // result[idx++] = r
            result.push(r)
        }
    }
    return result
}

let functionalResult, losslessResult, imperativeResult;
const iterations = 1000;

for(let i = 0; i < iterations; i++) {
    performance.mark('Functional');
    functionalResult = functionalTest(a);
}
performance.measure('Functional', 'Functional');

let loss = new Lossless(a)

for(let i = 0; i < iterations; i++) {
    performance.mark('Lossless');
    losslessResult = losslessTest(loss);
}
performance.measure('Lossless', 'Lossless');

for(let i = 0; i < iterations; i++) {
    performance.mark('Imperative');
    imperativeResult = imperativeTest(a);
}
performance.measure('Imperative', 'Imperative');

console.log(functionalResult, losslessResult, imperativeResult)

const functionalJSON = JSON.stringify(functionalResult);
const losslessJSON = JSON.stringify(losslessResult);
const imperativeJSON = JSON.stringify(imperativeResult);
console.log('All equal', functionalJSON === losslessJSON && losslessJSON === imperativeJSON);
