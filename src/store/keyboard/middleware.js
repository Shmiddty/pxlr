import bindings from './bindings';

// TODO: this whole thing must go away now.
export default function (store) {
  window.addEventListener('keydown', e => {
    console.log(e.code, e.key, e.keyCode); 
    if (document.activeElement.tagName === "INPUT") {
      // allow typing in input fields without hiccups
      return;
    }
    
    // don't interfere with browser shortcuts
    if (e.ctrlKey || e.shiftKey || e.altKey) return;

    if (e.key === "Tab") e.preventDefault(); // TODO: less hacky

    let action = bindings[e.key];
    if (action) {
      store.dispatch(action);
    }
    
    Array.from(document.querySelectorAll(`[data-key="${e.key}"]`))
      .forEach(ele => {
        ele.classList.add("activated");
        setTimeout(
          () => ele.classList.remove("activated"),
          250
        );
      });
  });
  
  return next => action => next(action);
}
