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
    if( !this.state.myAvailableLeave ) {
      return (
        <div>Loading...</div>
      )
    }
    return ( 
      <div>
        {/* { this.renderMyLeaveHistory() } */}
        {/* { this.renderMyAvailableLeaves() } */}
        { JSON.stringify( this.state.myLeaveApplicationList ) }
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