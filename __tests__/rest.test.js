function rest(a, b) {
  return (a - b);
}

test('rest two numbers', () => {
  expect(rest(7, 3)).toBe(4);
});
