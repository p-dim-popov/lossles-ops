const filter1 = e => e % 100 === 0;
const map1 = e => Math.sin(e);
const filter2 = e => e > 0;

function imperativeTest(arr) {
    let result = [];
    for (let i = 0, idx = 0; i < arr.length; i++) {
        const el = arr[i];

        if(!filter1(el)) continue;

        const projection = map1(el);

        if(!filter2(projection)) continue;

        result[idx++] = projection;
    }
    return result;
}

if (typeof module !== 'undefined') {
    module.exports = imperativeTest;
} else {
    const a = Array(1000).fill(0).map((e, i) => i)

    let imperativeResult;
    const iterations = 10000;

    for(let i = 0; i < iterations; i++) {
        imperativeResult = imperativeTest(a);
    }

    console.log(JSON.stringify(imperativeResult, null, '  '));
}
