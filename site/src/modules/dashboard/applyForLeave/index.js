import React from 'react'

import LeaveApplicationForm from './leaveApplicationForm'

import FloatingButton from '../../base/floatingButton'

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
        <tr>
          <td> { moment( parseInt( application.from_date ) ).format( 'D MMM, YYYY' ) } </td>
          <td> { moment( parseInt( application.to_date ) ).format( 'D MMM, YYYY' ) } </td>
          <td> { application.reason } </td>
          <td> {  ( application.approval_immediate > 0 ) ? 'approved' : ( application.approval_immediate < 0 ) ? 'rejected' : 'pending' } </td>
          <td> {  ( application.approval_senior > 0 ) ? 'approved' : ( application.approval_senior < 0 ) ? 'rejected' : 'pending' } </td>
          { application.approval_immediate == 0 && application.approval_senior == 0 ? <td> <button onClick={ ()=>this.cancelLeaveApplication( application.leave_id, index ) }>Cancel</button> </td>: '' }
        </tr>
      )
    }

    return (
      <div>
        <div className='subtitle'>My Leave History</div>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Senior Manager Approval</th>
              <th>Manager Approval</th>
            </tr>
          </thead>
          { this.state.myLeaveApplicationList.map( ( application, index )=>renderApplication( application, index ) ) }
        </table>
      </div>
    )
  }

  renderMyAvailableLeaves() {
    const accumulatedList = [ <th>Accumulated</th> ]
    const thisYearList = [ <th>This Year</th> ]
    const usedList = [ <th>Used</th> ]

    const keys = Object.keys( this.state.myAvailableLeave )
    for( let i in keys ) {
      accumulatedList.push( <td>{ this.state.myAvailableLeave[ keys[i] ].accumulated }</td> )
      thisYearList.push( <td>{ this.state.myAvailableLeave[ keys[i] ].this_year }</td> )
      usedList.push( <td>{ this.state.myAvailableLeave[ keys[i] ].used }</td> )
    }
    
    return ( 
      <div>
        <div className='subtitle'>My Remaining Leaves</div>
        <table>
          <thead>
            <tr>
              <th></th>
              { keys.map( key=><th>{ key }</th> ) }
            </tr>
          </thead>
          <tbody>
            <tr> { accumulatedList } </tr>
            <tr> { thisYearList } </tr>
            <tr> { usedList } </tr>
          </tbody>
        </table>
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
      <div className='applyForLeave-container'>
        <div className='title-container'>
          <div className='title'>
            My Leave
          </div>
        </div>
        
        { this.renderMyLeaveHistory() }
        
        { this.renderMyAvailableLeaves() }

        <FloatingButton 
          icon='/icons/plus.svg'
          onClick={ ()=>{ window.modalManager.current.openModal( 
            <LeaveApplicationForm 
              myLeaveApplicationList={ this.state.myLeaveApplicationList } 
              myAvailableLeave={ this.state.myAvailableLeave } 
              /> 
            ) } }/>
      </div>
    )
  }
}

export default ApplyForLeave