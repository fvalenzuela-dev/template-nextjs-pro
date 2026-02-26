function sum(a, b) {
  return (a + b)*2;
}

test('sum adds two numbers', () => {
  expect(sum(2, 3)).toBe(10);
});
