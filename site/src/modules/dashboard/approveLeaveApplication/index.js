import React from 'react'

import interactor from './interactor'

const moment = require( 'moment' )

class ApproveLeaveApplication extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {}
  
  
  }
  componentWillMount() {
    const cb = ( data )=>{
      this.setState({
        leaveApplicationList: data 
      })
    }
    interactor.getLeaveApplicationList( cb )
  }
  
  approve( formId, index ) {
    const cb = ()=>{
      this.state.leaveApplicationList.splice( index, 1 )
      this.forceUpdate()
      alert( 'Application approved!' )
    }
    interactor.approve( formId, cb )
  }
  
  reject( formId, index ) {
    const cb = ()=>{
      this.state.leaveApplicationList.splice( index, 1 )
      this.forceUpdate()
      alert( 'Application rejected!' )
    }
    interactor.reject( formId, cb )
  } 

  renderApplication( index, application ) {
    const approvalStatus = ( status )=>{
      switch( status ) {
        case 1:
          return 'Approved'
        case 0:
          return 'Pending'
        case -1:
          return 'Rejected'
      }
    }
    return ( 
      <tr>
        <td> { application.name } </td>
        <td> {  moment( parseInt( application.from_date ) ).format( 'D MMM, YYYY' )  } </td>
        <td> {  moment( parseInt( application.to_date ) ).format( 'D MMM, YYYY' )  } </td>
        <td> { application.reason } </td>
        <td> { application.department } </td>
        <td> { application.position } </td>
        <td> { approvalStatus( application.approval_senior ) } </td>
        <td> { approvalStatus( application.approval_immediate ) } </td>
        <td> 
          <button onClick={ ()=>this.approve( application.leave_id, index ) }>Approve</button> 
          <button onClick={ ()=>this.reject( application.leave_id, index ) }>Reject</button>
        </td>
      </tr>
    )
  }

  render() {
    if( !this.state.leaveApplicationList || !this.state.leaveApplicationList.length ) {
      return (
        <div>
          Leave Application list is empty!
        </div>
      )
    }
    return (
      <div className='approveLeaveApplication-container'>
        <div className='title-container'>
          <div className='title'>
            Approve Leave Application
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Department</th>
              <th>Position</th>
              <th>Senior Manager Approval</th>
              <th>Manager Approval</th>
            </tr>
          </thead>
          { this.state.leaveApplicationList.map( ( application, index )=>this.renderApplication( index, application ) ) }
        </table>
      </div>
    )
  }
}


export default ApproveLeaveApplication