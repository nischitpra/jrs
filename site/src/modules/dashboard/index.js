import React from 'react'
import { Redirect } from "react-router-dom";

import EmployeeList from './employeeList'
import Registration from './registrationList'
import Profile from './profile'

import interactor from './interactor'
import ApplyForLeave from './applyForLeave';
import ApproveLeaveApplication from './approveLeaveApplication';
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
    
    const generateButton = ( tag, text )=>{
      return (
        <button className={ this.state.active == text? 'active' : '' }
          onClick={ ()=>{ this.setState({ active: text, renderContent: tag }, this.setToolbar ) } } >{ text }</button>
      )
    }

    if( this.state.account.position == 'CEO' ) {
      options.push( generateButton( <EmployeeList/>, 'Employee List' ) )
      options.push( generateButton( <EditLeaveOptions/>, 'Leave Options' ) )
      options.push( generateButton( <EditPositionOptions/>, 'Position Options' ) )
      options.push( generateButton( <EditDepartmentOptions/>, 'Department Options' ) )
    }
    if( this.state.account.position == 'CEO' || this.state.account.position == 'Employee' ) {
      options.push( generateButton( <Registration/>, 'Employee Registration Form' ) )
    }
    options.push( generateButton( <ApproveLeaveApplication/>, 'Approve Leave Requests' ) )
    options.push( generateButton( <ApplyForLeave/>, 'My Leave' ) )

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
            <img className='logout' src='/icons/logout.svg' onClick={ this.logout }/>
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