import bindings from './bindings';

export default function (store) {
  window.addEventListener('keydown', e => {
    
    if (document.activeElement.tagName === "INPUT") {
      // allow typing in input fields without hiccups
      return;
    }
    
    // don't handle browser shortcuts
    if (e.ctrlKey || e.shiftKey || e.altKey) return;

    if (e.key === "Tab") e.preventDefault(); // TODO: less hacky

    let action = bindings[e.key];
    if (action) {
      store.dispatch(action);
    }
    
    Array.from(document.querySelectorAll(`[data-key="${e.key}"]`))
      .forEach(ele => {
        ele.className = [ele.className, 'activated'].join(' ');
        setTimeout(
          () => ele.className = ele.className.replace(/ activated/, ''), 
          250
        );
      });
  });
  
  return next => action => next(action);
}
