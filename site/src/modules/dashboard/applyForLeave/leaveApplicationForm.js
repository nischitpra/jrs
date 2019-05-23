import React from 'react'

import { values } from '../../../constants'
import interactor from './interactor'

const moment = require('moment')

class LeaveApplicationForm extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      leaveType: this.props.leaveType,
    }

    this.calculateTotalLeave = this.calculateTotalLeave.bind( this )
    this.submitLeaveApplication = this.submitLeaveApplication.bind( this )
  }
  
  submitLeaveApplication() {
    this.calculateTotalLeave()
    
    if( !this.state.fromDate ) return alert( 'Enter from date' )
    if( !this.state.toDate ) return alert( 'Enter to date' )
    if( this.state.fromDate > this.state.toDate ) return alert( 'From date should be less than To date' )
    
    const remainingLeaves = this.state.leaveType == 'without_pay'? 1 : this.props.remainingLeave[ this.state.leaveType ] - this.state.totalLeaveDays
    if( remainingLeaves < 0 ) return alert( 'Insufficient Leaves.' )
    if( !this.state.reason ) return alert( 'Enter reason' )
    if( !this.state.leaveType ) return alert( 'Select a Leave type' )

    for( let i in this.props.myLeaveApplicationList ) {
      if( this.props.myLeaveApplicationList[i].approval_count >= 0 && this.props.myLeaveApplicationList[i].approval_count < 2 ) {
        return alert( 'You already have a pending leave request.' )
      }
    }
    

    const cb = ()=>{
      alert( 'Leave Appication Submited.' )
    }

    const data = {
      from_date: new Date( this.state.fromDate ).getTime(),
      to_date: new Date( this.state.toDate ).getTime(),
      reason: this.state.reason,
      leave_type: this.state.leaveType,
      duration: this.state.totalLeaveDays,
    }

    interactor.submitLeaveApplication( data, cb )
  }

  calculateTotalLeave() {
    if( this.state.fromDate && this.state.toDate ) {
      const fromDateMoment = moment( this.state.fromDate )
      const toDateMoment = moment( this.state.toDate )
      const totalLeaveDays = toDateMoment.diff( fromDateMoment, 'days' ) + 1

      const remainingLeaves = this.state.leaveType == 'without_pay'? 1 : this.props.remainingLeave[ this.state.leaveType ] - totalLeaveDays

      if( remainingLeaves < 0 ) {
        alert( 'Insufficient Leaves.' )
      }

      this.setState({ totalLeaveDays })
    }
  }

  render() {
    return (
      <div>
        <input type='date' placeholder='From Date' onChange={ evt=>this.setState({ fromDate: evt.target.value }, this.calculateTotalLeave ) } /><br/>
        <input type='date' placeholder='To Date' onChange={ evt=>this.setState({ toDate: evt.target.value }, this.calculateTotalLeave ) } /><br/>
        { this.state.totalLeaveDays && <div>Total: { this.state.totalLeaveDays }days</div> }
        <select onChange={ evt=>this.setState({ leaveType: evt.target.value }, this.calculateTotalLeave ) } >
          <option value='personal'>Personal Leave</option>
          <option value='sick'>Sick Leave</option>
          <option value='casual'>Casual Leave</option>
          { window.user.sex='f' && <option value='maternity'>Maternity Leave</option> }
          <option value='mourning'>Mourning Leave</option>
          <option value='without_pay'>Leave Without Pay</option>
        </select>
        <span>Avilable: { this.props.leaveType == 'without_pay'? 'unlimited' : this.props.remainingLeave[ this.state.leaveType ] }</span>
        { this.state.totalLeaveDays && <span>Remaining: { this.props.leaveType == 'without_pay'? 'unlimited' : ( this.props.remainingLeave[ this.state.leaveType ] - this.state.totalLeaveDays ) }</span>}
        <br/>
        <input placeholder='reason' onChange={ evt=>this.setState({ reason: evt.target.value }) } /><br/>
        <button onClick={ this.submitLeaveApplication }>Submit</button>
      </div>
    )
  }
}


export default LeaveApplicationForm