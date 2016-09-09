import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import InboxContainer from './InboxContainer';
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="inbox/:author" component={InboxContainer} />
    </Route>
  </Router>,
  document.getElementById('root')
);
