import React from 'react'

import LeaveApplicationForm from './leaveApplicationForm'

import { values } from '../../../constants'
import interactor from './interactor'

const moment = require('moment')

class ApplyForLeave extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {}

    this.renderMyLeaveHistory = this.renderMyLeaveHistory.bind( this )
    this.cancelLeaveApplication = this.cancelLeaveApplication.bind( this )
  }

  componentWillMount() {
    const cb = ( data )=>{
      const formattedAvailableLeave = {}
      for( let i in data.myAvailableLeave ) {
        formattedAvailableLeave[ data.myAvailableLeave[i].type ] = data.myAvailableLeave[i]
      }
      this.setState({
        myLeaveApplicationList: data.myLeaveList,
        myAvailableLeave: formattedAvailableLeave,
      })

    }

    interactor.getMyLeaveApplications( cb )
  }
  
  cancelLeaveApplication( leave_id, index ) {
    const cb = ( data )=>{
      alert( 'Application cancelled!' )
      this.state.myLeaveApplicationList.splice( index, 1 )
      this.forceUpdate()
    }

    interactor.cancelLeaveApplication( { leave_id: parseInt( leave_id ) }, cb )
  }

  renderMyLeaveHistory() {
    if( !this.state.myLeaveApplicationList || !this.state.myLeaveApplicationList.length ) return

    const renderApplication = ( application, index )=>{
      return (
        <div>
          from: { moment( parseInt( application.from_date ) ).format( 'D MMM, YYYY' ) }, 
          to: { moment( parseInt( application.to_date ) ).format( 'D MMM, YYYY' ) }, 
          reason:{ application.reason }, 
          approval_immediate_boss: {  ( application.approval_immediate > 0 ) ? 'approved' : ( application.approval_immediate < 0 ) ? 'rejected' : 'pending' }
          approval_senior_boss: {  ( application.approval_senior > 0 ) ? 'approved' : ( application.approval_senior < 0 ) ? 'rejected' : 'pending' }
          { application.approval_immediate == 0 && application.approval_senior == 0 ? <button onClick={ ()=>this.cancelLeaveApplication( application.leave_id, index ) }>Cancel</button> : '' }
        </div>
      )
    }

    return (
      <div>
        <div>My Leave History</div>
        { this.state.myLeaveApplicationList.map( ( application, index )=>renderApplication( application, index ) ) }
      </div>
    )
  }

  renderMyAvailableLeaves() {
    const list = []
    const keys = Object.keys( this.state.remainingLeave )
    for( let i in keys ) {
      list.push( <div>{ keys[i] }: { this.state.remainingLeave[ keys[i] ] }</div> )
    }

    return ( 
      <div>
        <div>Remaining Leaves</div>
        { list }
      </div>
    )
  }

  render() {
    if( !this.state.myAvailableLeave ) {
      return (
        <div>Loading...</div>
      )
    }
    return ( 
      <div>
        { this.renderMyLeaveHistory() }
        {/* { this.renderMyAvailableLeaves() } */}
        { JSON.stringify( this.state.myAvailableLeave ) }
        <button onClick={ ()=>{ window.modalManager.current.openModal( 
          <LeaveApplicationForm 
            myLeaveApplicationList={ this.state.myLeaveApplicationList } 
            myAvailableLeave={ this.state.myAvailableLeave } 
            /> 
          ) } }>Apply for Leave</button><br/>
      </div>
    )
  }
}

export default ApplyForLeave