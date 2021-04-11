class Lossless {
    static Operations = Object.freeze({
      map: 1,
      filter: 2,
      reduce: 3,
    });

    static OperationsNames = Object.freeze([null, ...Object.keys(Lossless.Operations)])

    $$operations = [];

    map(fn) {
      fn.$name = Lossless.$$getOperationName(Lossless.Operations.map, this.$$operations.length);
      this.$$operations.push({
        type: Lossless.Operations.map,
        fn,
      });
      return this;
    }

    filter(fn) {
      fn.$name = Lossless.$$getOperationName(Lossless.Operations.filter, this.$$operations.length);
      this.$$operations.push({
        type: Lossless.Operations.filter,
        fn,
      });
      return this;
    }

    /**
     * @param fn
     * @param init
     * @returns {Lossless}
     */
    reduce(fn, init) {
      fn.$name = Lossless.$$getOperationName(Lossless.Operations.reduce, this.$$operations.length);
      this.$$operations.push({
        type: Lossless.Operations.reduce,
        fn,
        initialValue: init,
      });
      return this;
    }

    static $$getOperationName(op, index) {
      return `_${index}_${Lossless.OperationsNames[op]}`;
    }

    static $$iterateOps(operations) {
      let source = '';
      for (const { type: op, fn } of operations) {
        switch (op) {
          case Lossless.Operations.map:
            source += `
    element = ${fn.$name}(element);
`;
            break;
          case Lossless.Operations.filter:
            source += `
    if(!${fn.$name}(element)) { continue };
`;
            break;
          case Lossless.Operations.reduce:
            source += `
    result = ${fn.$name}(result, element);
`;
            break;
        }
      }

      return source;
    }

    $$getSource() {
      const loops = [[]];
      let currentLoop = 0;
      for (const op of this.$$operations) {
        loops[currentLoop].push(op);
        if (op.type === Lossless.Operations.reduce) {
          currentLoop += 1;
          loops[currentLoop] = [];
        }
      }
      if (loops[loops.length - 1].length === 0) {
        loops.pop();
      }

      let source = `
${this.$$operations.reduce((acc, { type, fn }, idx) => `${acc}const ${Lossless.$$getOperationName(type, idx)} = ${fn.toString()};\n`, '')}
let idx = 0;
`;
      for (const [index, loop] of loops.entries()) {
        const last = loop[loop.length - 1];
        if (last.type !== Lossless.Operations.reduce) {
          if (index === 0) {
            source += 'let result = [];';
          } else {
            source += 'result = [];';
          }
        } else if (index === 0) {
          source += `let result = ${JSON.stringify(last.initialValue)};`;
        } else {
          if (!(last.initialValue instanceof Array || currentLoop === loops.length - 1)) { // FIXME: Check conditions
            throw new Error(`TODO: Too bad ${last.initialValue.constructor.name}`);
          }
          source += `
 array = result;
 result = ${JSON.stringify(last.initialValue)};
 `;
        }
        source += `
for(let element of array) {
`;
        source += Lossless.$$iterateOps(loop);
        if (last.type === Lossless.Operations.reduce) {
          source += `
}`;
        } else {
          source += `
    result[idx++] = element;
}
`;
        }
      }
      source += `
return result;
`;
      return `
try {
${source}
} catch (err) {
    if (err instanceof ReferenceError) {
        throw new ReferenceError('Cannot reference variables outside function!')
    }
}
`;
    }

    compile() {
      return new Function('array', this.$$getSource());
    }
}

module.exports = {
  Lossless,
};
