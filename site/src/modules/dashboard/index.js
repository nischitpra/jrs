import React from 'react'
import { Redirect } from "react-router-dom";

import EmployeeList from './employeeList'
import Registration from './registrationList'
import Profile from './profile'

import interactor from './interactor'
import ApplyForLeave from './applyForLeave';
import LeaveApplication from './leaveApplicationList/leaveApplications';
import EditLeaveOptions from './editLeaveOptions'
import EditPositionOptions from './editPositionOptions'
import EditDepartmentOptions from './editDepartmentOptions'

export default class Dashboard extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {}
    
    this.logout = this.logout.bind( this )
    this.setToolbar = this.setToolbar.bind( this )
  }

  componentWillMount() {
    window.addEventListener("beforeunload", ( evt ) => {  
      evt.preventDefault();
      const cb = ()=>{
        alert( 'Logout successful.' )
        window.user = undefined
        this.setState({
          redirect: '/',
        })
      }
      interactor.logout( cb )
    })

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
      options.push( <button onClick={ ()=>{ this.setState({ renderContent: <EditLeaveOptions/> }) } } >Leave Options</button> )
      options.push( <button onClick={ ()=>{ this.setState({ renderContent: <EditPositionOptions/> }) } } >Position Options</button> )
      options.push( <button onClick={ ()=>{ this.setState({ renderContent: <EditDepartmentOptions/> }) } } >Department Options</button> )

    }
    if( this.state.account.position == 'CEO' || this.state.account.position == 'Employee' ) {
      options.push( <button onClick={ ()=>{ this.setState({ renderContent: <Registration/> }) } } >Employee Registration Form</button> )
    }
    options.push( <button onClick={ ()=>{ this.setState({ renderContent: <LeaveApplication/> })} } >Approve Leave Requests</button> )
    options.push( <button onClick={ ()=>{ this.setState({ renderContent: <ApplyForLeave/> })} }>My Leave</button> )

    this.setState({
      toolbar: options,
    })
  }
  
  render() {
    if( this.state.redirect ) {
      return <Redirect to={{ pathname: this.state.redirect }} />
    }
    
    if( !window.user ) {
      this.setState({ redirect: '/'})
      return (
        <div>
          Please Login to access content.
        </div>
      )
    }

    return (
      <div className='dashboard-container'>
        <div className='navbar'>
          <a href='/dashboard' className='logo'>
            <img src='/favicon.ico' />
          </a>
          <div className='profile-container'>
            <div className='profile' onClick={ ()=>{this.setState({ renderContent: <Profile/>})} }>
              { this.state.account && `${ this.state.account.name } ( ${ window.user.employeeId } )` }
            </div>
            <img className='logout' src='/favicon.ico' onClick={ this.logout }/>
          </div>
        </div>
        <div className='content'>
          <div className='left-pane'>
            { this.state.toolbar }
          </div>
          <div className='right-pane'>
            
            { this.state.renderContent }
          </div>
        </div>
      </div>
    )
  }

}