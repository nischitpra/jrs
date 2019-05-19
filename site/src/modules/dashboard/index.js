import React from 'react'
import { Redirect } from "react-router-dom";

import EmployeeList from './employeeList'
import Registration from './registrationList'
import Profile from './profile'

import interactor from './interactor'

export default class Dashboard extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {}
    
    this.logout = this.logout.bind( this )
    this.setToolbar = this.setToolbar.bind( this )
  }

  componentWillMount() {
    const cb = ( data )=>{
      this.setState({
        account: data,
      }, this.setToolbar )
    }
    interactor.getAccountDetails( cb )
  }
  
  logout() {
    const cb = ()=>{
      alert( 'Logout Successful.' )
      window.user = undefined
      this.setState({
        redirect: '/',
      })
    }
    interactor.logout( cb )
  }

  setToolbar() {
    const options = []
    if( this.state.account.position == 'CEO' ) {
      options.push( <button onClick={ ()=>{ this.setState({ renderContent: <EmployeeList/> }) } } >Employee List</button> )
    }
    if( this.state.account.position == 'CEO' || this.state.account.position == 'Employee' ) {
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
        <span onClick={ ()=>{this.setState({ renderContent: <Profile/>})} }>{ this.state.account && this.state.account.name }</span>
        <button onClick={ this.logout }>Logout</button><br/>
        { this.state.toolbar }
        { this.state.renderContent }
      </div>
    )
  }

}