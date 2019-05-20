import React from 'react'

import interactor from './interactor'

class LeaveApplication extends React.Component {
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
    return ( 
      <div>
        <span> { application.name } </span>
        <span> { application.from_date } </span>
        <span> { application.to_date } </span>
        <span> { application.reason } </span>
        <span> { application.department } </span>
        <span> { application.position } </span>
        <span> { application.approval_count } </span>
        <button onClick={ ()=>this.approve( application.leave_id, index ) }>Approve</button>
        <button onClick={ ()=>this.reject( application.leave_id, index ) }>Reject</button>
      </div>
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
      <div>
        { this.state.leaveApplicationList.map( ( application, index )=>this.renderApplication( index, application ) )}
      </div>
    )
  }
}


export default LeaveApplication