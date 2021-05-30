export default function logger(store) {
  return next => action => {
    console.log(action);

    return next(action);
  };
}

