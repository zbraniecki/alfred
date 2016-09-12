import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App/App';
import ReportContainer from './Report/ReportContainer';
import ReviewContainer from './Review/ReviewContainer';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="report/:year-:month-:day" component={ReportContainer} />
      <Route path="review/:author/:year-:month-:day" component={ReviewContainer} />
    </Route>
  </Router>,
  document.getElementById('root')
);
