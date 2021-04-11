const { Lossless } = require('../src/lossless');

const filter1 = (e) => e % 100 === 0;
const map1 = (e) => Math.sin(e);
const filter2 = (e) => e > 0;

const losslessCodeGenFunction = new Lossless()
  .filter(filter1)
  .map(map1)
  .filter(filter2)
  .compile();

function losslessCodeGenTest(arr) {
  return losslessCodeGenFunction(arr);
}

function losslessRuntimeCodeGenTest(arr) {
  return new Lossless()
    .filter(filter1)
    .map(map1)
    .filter(filter2)
    .compile()(arr);
}

module.exports = {
  tests: [losslessCodeGenTest, losslessRuntimeCodeGenTest],
};
