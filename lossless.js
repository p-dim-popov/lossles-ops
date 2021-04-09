const LOSSLESS_OPERATIONS_MAP = 1;
const LOSSLESS_OPERATIONS_FILTER = 2;
const LOSSLESS_OPERATIONS_REDUCE = 3;

const filter1 = e => e % 100 === 0;
const map1 = e => Math.sin(e);
const filter2 = e => e > 0;

class Lossless {
    #length = 0;
    #ops = [];
    #fns = [];

    constructor() {

    }

    map(fn) {
        this.#ops[this.#length] = (LOSSLESS_OPERATIONS_MAP)
        this.#fns[this.#length] = (fn)
        this.#length++
        return this
    }

    filter(fn) {
        this.#ops[this.#length] = (LOSSLESS_OPERATIONS_FILTER)
        this.#fns[this.#length] = (fn)
        this.#length++
        return this
    }

    reduce(fn) {
        this.#ops[this.#length] = (LOSSLESS_OPERATIONS_REDUCE)
        this.#fns[this.#length] = (fn)
        this.#length++
        return this
    }

    run(array) {
        const result = [];
        const length = array.length
        let idx = 0;

        elementIteration: for (let i = 0; i < length; i++){
            let element = array[i];
            for (let op = 0; op < this.#length; op++) {
                switch (this.#ops[op]) {
                    case LOSSLESS_OPERATIONS_MAP:
                        element = this.#fns[op](element);
                        break;
                    case LOSSLESS_OPERATIONS_FILTER:
                        if (!this.#fns[op](element)) {
                            continue elementIteration;
                        }
                        break;
                }
            }
            result[idx++] = (element);
        }
        return result;
    }

    compile() {
        let source = `
let result = []
${this.#fns.reduce((acc, fn, i) => acc + `const fn${i} = ${fn.toString()};\n`, '')}
const len = array.length;
let acc = 0;
for (let i = 0, idx = 0; i < len; i++) {
    let element = array[i];
`;
        for (let op = 0; op < this.#length; op++) {
            switch (this.#ops[op]) {
                case LOSSLESS_OPERATIONS_MAP:
                    source += `\telement = fn${op}(element)\n`;
                    break;
                case LOSSLESS_OPERATIONS_FILTER:
                    source += `\tif(!fn${op}(element)) { continue }\n`;
                    break;
                case LOSSLESS_OPERATIONS_REDUCE:
                    if(op !== this.#length - 1) {
                        throw "TODO: Too bad";
                    }
                    source += `\tacc = fn${op}(acc, element)`
            }
        }
        if(this.#ops[this.#length - 1] === LOSSLESS_OPERATIONS_REDUCE) {
            source += `
}
return acc;
`;
        }else{
            source += `
    result[idx++] = element;
}
return result;
`;
        }

        console.error(source)

        return new Function("array", source);
    }
}


function losslessTest(arr) {
    return new Lossless()
        .filter(filter1)
        .map(map1)
        .filter(filter2)
        .run(arr)
}

new Lossless()
    .filter((a) => a > 5)
    .map(map1)
    .reduce((a,b) => a + b, 0)
    .compile()


let losslessCodeGenFunction = new Lossless()
    .filter(filter1)
    .map(map1)
    .filter(filter2)
    .compile()

console.error("" + losslessCodeGenFunction)

function losslessCodeGenTest(arr) {
    return losslessCodeGenFunction(arr);
}


module.exports = [ losslessTest, losslessCodeGenTest ];
