import memoize from 'lodash/memoize';

export default function memo(fn) {
  return memoize(fn, makeKey);
}

function makeKey(...args) {
  return args.toString();
}


