/**
 * Memoizes a 1-arity function
 *
 * @param {Function} func Function to memoize
 * @returns {Function} Memoized version of func.
 */
const memoize = func => {
  var cache = {};
  return x => {
    if (x in cache == false) {
      cache[x] = func(x);
    }
    return cache[x];
  };
};

export default memoize;
