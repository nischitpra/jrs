import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from './modules/login';
import ApplyForJob from './modules/applyForJob';
import Dashboard from './modules/dashboard';

function App() {
  return (
    <Router>
      <Route exact path="/" component={ Login } />
      <Route exact path="/dashboard" 
        render={ (props)=> 
          <Dashboard position={ props.location.position } employeeId={ props.location.state.employeeId } position={ props.location.state.position } /> } 
        />
      <Route exact path="/applyForJob" component={ ApplyForJob } />
    </Router>
  );
}

export default App;
