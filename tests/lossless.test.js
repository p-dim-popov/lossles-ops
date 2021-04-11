const { Lossless } = require('../src/lossless');

describe('Simple lossless test', () => {
  test('Test simple reduce', () => {
    const sum = new Lossless()
      .reduce((acc, current) => acc + current, 0)
      .compile();
    console.log(sum.toString());
    expect(sum([1, 2, 3])).toBe(6);
  });

  test('Test simple filter', () => {
    const filter = new Lossless()
      .filter((item) => item > 5)
      .compile();
    console.log(filter.toString());

    expect(filter([1, 2, 3, 9])).toStrictEqual([9]);
  });

  test('Test simple map', () => {
    const map = new Lossless()
      .map((item) => item + 9)
      .compile();
    console.log(map.toString());
    expect(map([1, 2, 3])).toStrictEqual([10, 11, 12]);
  });

  test('Test reduce', () => {
    const reduced = new Lossless()
      .filter((a) => a > 5)
      .reduce((acc, cur) => {
        if (cur === 5) {
          return [cur, ...acc];
        }
        return [...acc, cur];
      }, [])
      .reduce((a, b) => a + b, 0)
      .compile();

    console.log(reduced.toString());

    const result = reduced('7893457834567823789397802'.split('').map(parseInt));
    const real = '7893457834567823789397802'.split('').map(parseInt)
      .filter((a) => a > 5)
      .reduce((acc, cur) => {
        if (cur === 5) {
          return [cur, ...acc];
        }
        return [...acc, cur];
      }, [])
      .reduce((a, b) => a + b, 0);

    expect(result)
      .toStrictEqual(real);
  });

  test('Security', () => {
    const date = new Date();
    const t = new Lossless()
      .map(() => date % 2)
      .compile();

    expect(() => t([1, 2, 3])).toThrowError(ReferenceError);
    console.log(t.toString());
  });
});
