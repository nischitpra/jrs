import React from 'react';
import './App.scss';

import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from './modules/login';
import ApplyForJob from './modules/applyForJob';
import Dashboard from './modules/dashboard';

import ModalManager from './modules/modalManager'

class App extends React.Component {
  constructor( props ) {
    super( props )
    window.modalManager = React.createRef();
  }
  
  render() {
    return (
      <div className='app-container'>
        <Router>
          <Route exact path="/" component={ Login } />
          <Route exact path="/dashboard" render={ (props)=> <Dashboard position={ props.location.position } /> } />
          <Route exact path="/applyForJob" component={ ApplyForJob } />
        </Router>
        <ModalManager ref={window.modalManager} zIndex={0}/>
      </div>
    );
  }
}

export default App;