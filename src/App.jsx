import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

import Modes from './components/Modes';
import Toggles from './components/Toggles';
import Tools from './components/Tools';

export default function App(props) {
  return (
    <Provider store={store}>
      <Modes />
      <Toggles />
      <Tools />
    </Provider>
  );
}
