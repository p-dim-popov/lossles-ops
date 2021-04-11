const filter1 = e => e % 100 === 0;
const map1 = e => Math.sin(e);
const filter2 = e => e > 0;

function functionalTest(arr) {
    return arr
        .filter(filter1)
        .map(map1)
        .filter(filter2)
}

if (typeof module !== 'undefined') {
    module.exports = functionalTest;
} else {
    const a = Array(1000).fill(0).map((e, i) => i)

    let functionalResult;
    const iterations = 10000;

    for(let i = 0; i < iterations; i++) {
        functionalResult = functionalTest(a);
    }

    console.log(JSON.stringify(functionalResult, null, '  '));
}
