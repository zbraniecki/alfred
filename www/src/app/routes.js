import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import App from './views/App';
import About from './views/About';
import ReportContainer from './views/ReportContainer';
import InboxContainer from './views/InboxContainer';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    <Route path="about" component={About} />
    <Route path="report/:year-:month-:day" component={ReportContainer} />
    <Route path="inbox/:author" component={InboxContainer} />

    // XXX remove legacy urls
    <Redirect from=":author" to="inbox/:author" />
    <Redirect path="review/:author/:year-:month-:day" to="inbox/:author" />
    </Route>
  </Router>
)
