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
    this.calculateLeaveLimits = this.calculateLeaveLimits.bind( this )

  }

  componentWillMount() {
    const cb = ( data )=>{
      this.calculateLeaveLimits( data )
      this.setState({
        myLeaveApplicationList: data.myLeaveList,
      })

    }

    interactor.getMyLeaveApplications( cb )
  }

  calculateLeaveLimits( data ) {
    const remainingLeave = data.maxLeaveLimit
    this.setState({
      remainingLeave: remainingLeave,
      leaveType: Object.keys( remainingLeave )[0]
    })
  } 

  renderMyLeaveHistory() {
    if( !this.state.myLeaveApplicationList || !this.state.myLeaveApplicationList.length ) return

    const renderApplication = ( application )=>{
      return (
        <div>
          from: { moment( parseInt( application.from_date ) ).format( 'D MMM, YYYY' ) }, to: { moment( parseInt( application.to_date ) ).format( 'D MMM, YYYY' ) }, reason:{ application.reason }, approval: {  ( application.approval_count >= 2 ) ? 'approved' : ( application.approval_count < 0 ) ? 'rejected' : ( application.approval_count == 0 ) ? 'pending' : 'partially approved' }
        </div>
      )
    }

    return (
      <div>
        <div>My Leave History</div>
        { this.state.myLeaveApplicationList.map( application=>renderApplication( application ) ) }
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
    if( !this.state.myLeaveApplicationList || !this.state.remainingLeave || !this.state.leaveType ) {
      return (
        <div>Loading...</div>
      )
    }
    console.log( this.state.remainingLeave, this.state.leaveType, this.state.remainingLeave[ this.state.leaveType ])
    return ( 
      <div>
        { this.renderMyLeaveHistory() }
        { this.renderMyAvailableLeaves() }
        <button onClick={ ()=>{ window.modalManager.current.openModal( 
          <LeaveApplicationForm 
            myLeaveApplicationList={ this.state.myLeaveApplicationList } 
            remainingLeave={ this.state.remainingLeave } 
            leaveType={ this.state.leaveType } /> 
          ) } }>Apply for Leave</button><br/>
      </div>
    )
  }
}

export default ApplyForLeave