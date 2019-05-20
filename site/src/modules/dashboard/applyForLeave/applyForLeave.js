import React from 'react'

import { values } from '../../../constants'

import interactor from './interactor'

class ApplyForLeave extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {}

    this.renderMyLeaveApplications = this.renderMyLeaveApplications.bind( this )
    this.submitLeaveApplication = this.submitLeaveApplication.bind( this )
  }

  componentWillMount() {
    const cb = ( data )=>{
      this.setState({
        myLeaveApplicationList: data,
      })
    }

    interactor.getMyLeaveApplications( cb )
  }

  submitLeaveApplication() {
    if( !this.state.fromDate ) return alert( 'Enter from date' )
    if( !this.state.toDate ) return alert( 'Enter to date' )
    if( !this.state.reason ) return alert( 'Enter reason' )
    if( this.state.fromDate > this.state.toDate ) return alert( 'From date should be less than To date' )

    const cb = ()=>{
      alert( 'Leave Appication Submited.' )
    }

    let totalLeaveAvailed = 0
    for( let i in this.state.myLeaveApplicationList ) {
      if( this.state.myLeaveApplicationList[i].approval_count >= 0 && this.state.myLeaveApplicationList[i].approval_count < 2 ) {
        return alert( 'You already have a pending leave request.' )
      }
      if( this.state.myLeaveApplicationList[i].approval_count >= 2 ) {
        totalLeaveAvailed++
        if( totalLeaveAvailed >= values.applyForLeave.maxLeave ) {
          return alert( 'No more leaves available.' )
        }
      }
    }

    interactor.submitLeaveApplication({ from_date: new Date( this.state.fromDate ).getTime(), to_date: new Date( this.state.toDate ).getTime(), reason: this.state.reason }, cb )
  }

  renderMyLeaveApplications() {
    if( !this.state.myLeaveApplicationList || !this.state.myLeaveApplicationList.length ) return

    const renderApplication = ( application )=>{
      return (
        <div>
          from: { application.from_date }, to: { application.to_date }, reason:{ application.reason }, approval: {  ( application.approval_count >= 2 ) ? 'approved' : ( application.approval_count < 0 ) ? 'rejected' : ( application.approval_count == 0 ) ? 'pending' : 'partially approved' }
        </div>
      )
    }

    return (
      <div>
        { this.state.myLeaveApplicationList.map( application=>renderApplication( application ) ) }
      </div>
    )
  }

  render() {
    return ( 
      <div>
        { this.renderMyLeaveApplications() }
        Apply for Leave<br/>
        <input type='date' placeholder='From Date' onChange={ evt=>this.setState({ fromDate: evt.target.value }) } /><br/>
        <input type='date' placeholder='To Date' onChange={ evt=>this.setState({ toDate: evt.target.value }) } /><br/>
        <input placeholder='reason' onChange={ evt=>this.setState({ reason: evt.target.value }) } /><br/>
        <button onClick={ this.submitLeaveApplication }>Submit</button>
      </div>
    )
  }
}

export default ApplyForLeave