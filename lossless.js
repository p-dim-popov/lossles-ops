const LOSSLESS_OPERATIONS_MAP = 1;
const LOSSLESS_OPERATIONS_FILTER = 2;

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

    get(array) {
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
    return new Lossless()
        .filter(filter1)
        .map(map1)
        .filter(filter2)
        .get(arr)
}

let losslessCodeGenFunction = new Lossless()
    .filter(filter1)
    .map(map1)
    .filter(filter2)
    .getFunction()

function losslessCodeGen(arr) {
    return losslessCodeGenFunction(arr);
}


// module.exports = losslessTest;
module.exports = losslessCodeGen;
