import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import ReviewContainer from './Review/ReviewContainer';
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="review/:author/:year-:month-:day" component={ReviewContainer} />
    </Route>
  </Router>,
  document.getElementById('root')
);
