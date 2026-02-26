const rest = require('../src/utils/rest');

test('rest two numbers', () => {
  expect(rest(7, 3)).toBe(4);
});
