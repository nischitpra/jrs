import React from 'react'
import { Redirect } from "react-router-dom";

import Registration from './registration';

export default class HrDashboard extends React.Component {

  constructor( props ) {
    super( props )
    this.state = {}

    this.logout = this.logout.bind( this )
  }

  logout() {
    this.setState({
      redirect: '/',
    })
  }

  render() {
    if( this.state.redirect ) {
      return <Redirect to={{ pathname: this.state.redirect }} />
    }
    
    return (
      <div>
        <Registration/>
        <button onClick={ this.logout }>Logout</button>
      </div>
    )
  }
}