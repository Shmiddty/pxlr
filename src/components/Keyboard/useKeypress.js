import { useEffect } from "react";

function getKey(code, shift, ctrl, alt) {
  return [shift && "shift", ctrl && "ctrl", alt && "alt", code]
    .filter(Boolean)
    .toString();
}
const listeners = {};
function handleKeypress(e) {
  if (document.activeElement.tagName === "INPUT") {
    if (["Escape", "Enter", "Return"].includes(e.code))
      document.activeElement.blur(); 
    return; // don't interfere with typing.
  }
  
  let cb = listeners[getKey(e.code, e.shiftKey, e.ctrlKey, e.altKey)];
  if (!cb) return; 
  
  let canRepeat = cb.repeat;
  if (e.repeat && !canRepeat) return; 

  e.preventDefault();
  cb(e);
}
window.addEventListener("keydown", handleKeypress);

// TODO: there's a flaw in that this can't handle multiple callbacks for the same key
export default function useKeypress(
  code,
  callback, 
  {
    shift = false,
    ctrl = false,
    alt = false,
    repeat = false
  } = {}
) {
  useEffect(() => {
    let key = getKey(code, shift, ctrl, alt);
    callback.repeat = repeat;
    listeners[key] = callback;
    return () => delete listeners[key];
  }, [code, callback, shift, ctrl, alt, repeat]);
}
