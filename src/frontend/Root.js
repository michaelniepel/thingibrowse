import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { Application, Browser } from './components';
import * as reducers from './reducers';

const reducer = combineReducers(reducers);
const finalCreateStore = applyMiddleware(thunk)(createStore);
const store = finalCreateStore(reducer);

export default class Root extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Provider store={ store }>
        <Router history={ history }>
          <Route path='/' component={ Application } >
            <IndexRoute component={ Browser } />
            <Route path='/view' component={ Browser } />
          </Route>
        </Router>
      </Provider>
    );
  }
}
Root.propTypes = {
    history: PropTypes.object.isRequired
};
