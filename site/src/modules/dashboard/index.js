import React from 'react'
import { Redirect } from "react-router-dom";

import EmployeeList from './employeeList'
import Registration from './registrationList'

export default class Dashboard extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {}
    this.logout = this.logout.bind( this )
    this.setToolbar = this.setToolbar.bind( this )
  }

  componentWillMount() {
    this.setToolbar()
  }
  
  logout() {
    this.setState({
      redirect: '/',
    })
  }

  setToolbar() {
    const options = []
    if( this.props.position == 'CEO' ) {
      options.push( <button onClick={ ()=>{ this.setState({ renderContent: <EmployeeList/> }) } } >Employee List</button> )
    }
    if( this.props.position == 'CEO' || this.props.position == 'HR' ) {
      options.push( <button onClick={ ()=>{ this.setState({ renderContent: <Registration/> }) } } >Employee Registration Form</button> )
    }
    this.setState({
      toolbar: options,
    })
  }
  
  render() {
    if( this.state.redirect ) {
      return <Redirect to={{ pathname: this.state.redirect }} />
    }
    
    return (
      <div>
        <button onClick={ this.logout }>Logout</button><br/>
        { this.state.toolbar }
        { this.state.renderContent }
      </div>
    )
  }

}