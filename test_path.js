import { pathToRegexp, match } from 'path-to-regexp';

const test = (pattern, path) => {
  try {
    const fn = match(pattern);
    const result = fn(path);
    if (result) {
      console.log(`MATCH: ${pattern} matches ${path}`);
    } else {
      console.log(`NO MATCH: ${pattern} does not match ${path}`);
    }
  } catch (e) {
    console.log(`ERROR: ${pattern} - ${e.message}`);
  }
};

console.log("--- Testing / ---");
test('/*splat', '/');
test('*splat', '/');
test('{/*splat}', '/');
test('/:path*', '/');

console.log("--- Testing /home ---");
test('/*splat', '/home');
test('*splat', '/home');
test('{/*splat}', '/home');
test('/:path*', '/home');
