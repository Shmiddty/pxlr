import merge from 'lodash/merge';
import throttle from 'lodash/throttle';

/**
 * makePersistence - creates a redux middleware that will hydrate state on 
 * initialization and dehydrate and save the global state each time 
 * an action is performed (throttled by the rateLimit option)
 * key: String - they localStorage key to use
 * options: Object - configuration options
 * options.defaultState: Object <{}> - merged with the initial rehydrated state
 * options.dehydrate: Function <I=>I> - transform state before saving
 * options.rehydrate: Function <I=>I> - transform stored data before returning initial state
 * options.rateLimit: Number <1000> - rate at which to throttle saving
 */
export default function makePersistence(key = "app-data", {
  defaultState = {}, 
  dehydrate = I=>I, 
  rehydrate = I=>I,
  rateLimit = 1000
}) {
  function Persist(store) {
    const save = throttle(() => {
      localStorage.setItem(key, JSON.stringify(dehydrate(store.getState())));
    }, rateLimit);

    return next => action => {
      const result = next(action);
      save(); // It's important to do this after the actions has been performed.
      return result;
    };
  }

  return [
    merge({}, defaultState, rehydrate(JSON.parse(localStorage.getItem(key)) || {})),
    Persist
  ];
}

