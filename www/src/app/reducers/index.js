import { combineReducers } from 'redux';
import updates from './updates';
import user from './user';
import reports from './reports';

export default combineReducers({
  updates,
  user,
  reports
});

