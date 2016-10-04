import { combineReducers } from 'redux';
import inbox from './inbox';
import report from './report';
import reportList from './reportList';

export default combineReducers({
  inbox,
  report,
  reportList
});

