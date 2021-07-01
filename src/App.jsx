import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

import Keyboard from './components/Keyboard';
import Canvas from './components/Canvas';
import SideLength from './components/SideLength';
import FileImport from './components/FileImport';

export default function App(props) {
  return (
    <Provider store={store}>
      <Keyboard />
      <span className="save-notice">(right click on the image to save it)</span>
      <Canvas />
      <SideLength />
      <FileImport />
    </Provider>
  );
}
