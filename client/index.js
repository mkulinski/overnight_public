import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import Login from './components/hello';
import Dashboard from './components/dashboard';

render((
  <Router history={browserHistory}>
    <Route path='/' component={Login} />
    <Route path='/dashboard' component={Dashboard} />
  </Router>
), document.getElementById('app'));
