import React from 'react';
import { Router, Route, IndexRoute, Redirect, browserHistory }
  from 'react-router';
import { Provider } from 'react-redux';

import store from './store';

import Home from './views/Home';
import About from './views/About';
import ReportContainer from './views/ReportContainer';
import InboxContainer from './views/InboxContainer';

export default (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
        <Route path="report/:year-:month-:day" component={ReportContainer} />
        <Route path="inbox/:author" component={InboxContainer} />

        // XXX remove legacy urls
        <Redirect from=":author" to="inbox/:author" />
        <Redirect path="review/:author/:year-:month-:day" to="inbox/:author" />
      </Route>
    </Router>
  </Provider>
);

