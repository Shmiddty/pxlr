import { combineReducers } from 'redux';
import config from './config/reducer';
import palette from './palette/reducer';
import canvas from './canvas/reducer';

export default combineReducers({
  config,
  palette,
  canvas
});
