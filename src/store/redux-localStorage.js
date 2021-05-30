import merge from 'lodash/merge';

export default function makePersistence(key, defaultState) {
  function Persist(store) {
    return next => action => {
      const result = next(action);
      
      localStorage.setItem(key, JSON.stringify(store.getState()));
      
      return result;
    };
  }

  return [
    merge({}, defaultState, JSON.parse(localStorage.getItem(key)) || {}),
    Persist
  ];
}

