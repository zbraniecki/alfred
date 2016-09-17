import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import App from './views/App';
import About from './views/About';
import ReportContainer from './views/ReportContainer';
import ReviewContainer from './views/ReviewContainer';
import InboxContainer from './views/InboxContainer';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    <Route path="about" component={About} />
    <Route path="report/:year-:month-:day" component={ReportContainer} />
    <Route path="review/:author/:year-:month-:day" component={ReviewContainer} />
    <Route path=":author" component={InboxContainer} />
    </Route>
  </Router>
)
