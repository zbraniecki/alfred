import { combineReducers } from 'redux';
import inbox from './inbox';
import reports from './reports';

export default combineReducers({
  inbox,
  reports
});

