import {
  createStore,
  applyMiddleware,
  compose
}               from 'redux';
import thunk    from 'redux-thunk';
import reducers from './reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default createStoreWithMiddleware(reducers);

