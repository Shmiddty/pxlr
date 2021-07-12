import { useEffect } from 'react';

const listeners = {};
function handleKeypress (e) {
  if (e.repeat) return;
  if (e.ctrlKey || e.shiftKey || e.altKey) return;
  if (document.activeElement.tagName === "INPUT") return;

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
