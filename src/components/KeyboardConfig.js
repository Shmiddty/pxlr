import PaletteItem from './PaletteItem';
import Tool from './Tool';
import { Modes } from '../const/brush';

// TODO: should maybe use keyCodes instead?
export default {
  ...[].reduce.call('1234567890', (o, d, i) => {
    o['Digit' + d] = { 
      component: PaletteItem, 
      props: { 
        index: i
      } 
    };
    return o;
  }, {}),
  "Minus": {},
  "Equal": {},
  "Backspace": {},
  "Tab": {}
};
