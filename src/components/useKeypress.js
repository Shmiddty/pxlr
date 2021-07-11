import { useEffect } from 'react';

const listeners = {};
function handleKeypress (e) {
  console.log(e.code);
  const cb = listeners[e.code];
  if (cb) {
    e.preventDefault();
    cb(e);
  }
}
window.addEventListener('keydown', handleKeypress);

export default function useKeypress(code, callback) {
  useEffect(() => {
    listeners[code] = callback;
    return () => delete listeners[code];
  }, [code, callback]);
}
