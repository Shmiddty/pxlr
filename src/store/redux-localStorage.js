import merge from 'lodash/merge';

export default function makePersistence(
  key, 
  defaultState, 
  dehydrate = I=>I, 
  rehydrate = I=>I
) {
  function Persist(store) {
    return next => action => {
      const result = next(action);
      
      localStorage.setItem(key, JSON.stringify(dehydrate(store.getState())));
      
      return result;
    };
  }

  return [
    merge({}, defaultState, rehydrate(JSON.parse(localStorage.getItem(key)) || {})),
    Persist
  ];
}

