const LOSSLESS_OPERATIONS_MAP = 1;
const LOSSLESS_OPERATIONS_FILTER = 2;

const filter1 = e => e % 100 === 0;
const map1 = e => Math.sin(e);
const filter2 = e => e > 0;

class Lossless {
    #array;
    #length = 0;
    #ops = [];
    #fns = [];

    constructor(array) {
        this.#array = array
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

    get() {
        const result = [];
        let idx = 0;
        elementIteration: for (let element of this.#array){
            for (let i = 0; i < this.#length; i++) {
                switch (this.#ops[i]) {
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

    getFunction() {
        let source = "let result = []\n"
        this.#fns.forEach(fn => {
            source += `const ${fn.name} = ${fn.toString()}\n`  
        })
        source += "const len = array.length\n"
        source += "for (let i = 0, idx = 0; i < len; i++){\n"
        source += "\tlet element = array[i]\n"
        for (let op = 0; op < this.#length; op++) {
            switch (this.#ops[op]) {
                case LOSSLESS_OPERATIONS_MAP:
                    source += `\telement = ${this.#fns[op].name}(element)\n`;
                    break;
                case LOSSLESS_OPERATIONS_FILTER:
                    source += `\tif(!${this.#fns[op].name}(element)) { continue }\n`;
                    break;
            }
        }
        source += "\tresult[idx++] = element;\n"
        source += "}\n"
        source += "return result\n"
        console.error(source)

        return new Function("array", source);
    }
}



function losslessTest(arr) {
    return new Lossless(arr)
        .filter(filter1)
        .map(map1)
        .filter(filter2)
        .get()
}

let losslessCodeGenFunction = new Lossless()
    .filter(filter1)
    .map(map1)
    .filter(filter2)
    .getFunction()

function losslessCodeGen(arr) {
    return losslessCodeGenFunction(arr);
}

if (typeof module !== 'undefined') {
    // module.exports = losslessTest;
    module.exports = losslessCodeGen;
} else {
<<<<<<< HEAD
    const a = Array(100000).fill(0).map((e, i) => i)
=======
   

    const a = Array(100).fill(0).map((e, i) => i)
>>>>>>> 2bc4acd (Better benchmarking.)

    let losslessResult;
    const iterations = 10000;

    for(let i = 0; i < iterations; i++) {
        losslessResult = losslessTest(a);
    }

    console.log(JSON.stringify(losslessResult, null, '  '));
}
