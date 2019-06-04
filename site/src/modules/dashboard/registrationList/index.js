import React from 'react'

import interactor from './interactor'
import ApproveApplication from './approveApplication';

const moment = require('moment')

class Registration extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {}

  }

  componentWillMount() {
    const cb = ( data )=>{
      this.setState({
        registrationList: data 
      })
    }
    interactor.getRegistrationList( cb )
  }
  
  approve( formId, index ) {
    const cb = ()=>{
      this.state.registrationList.splice( index, 1 )
      this.forceUpdate()
      alert( 'Application approved!' )
    }
    interactor.approve( formId, cb )
  }
  
  reject( formId, index ) {
    const cb = ()=>{
      this.state.registrationList.splice( index, 1 )
      this.forceUpdate()
      alert( 'Application rejected!' )
    }
    interactor.reject( formId, cb )
  } 

  renderApplication( index, application ) {
    return ( 
      <tr onClick={ ()=>window.modalManager.current.openModal( 
        <ApproveApplication formId={ application.form_id } approve={ ()=>this.approve( application.form_id, index ) } reject={ ()=>this.reject( application.form_id, index ) }/>  ) } >

        <td>{ application.form_id }</td>
        <td>{ application.name }</td>
        <td>{ application.email }</td>
        <td>{ moment( parseInt( application.date_of_birth ) ).format( 'D MMM, YYYY' ) }</td>
        <td>{ application.department }</td>
        <td>{ application.position }</td>
        <td>
          <button onClick={ ()=>this.approve( application.form_id, index ) }>Approve</button>
          <button onClick={ ()=>this.reject( application.form_id, index ) }>Reject</button>
        </td>
      </tr>
    )
  }

  render() {
    if( !this.state.registrationList || !this.state.registrationList.length ) {
      return (
        <div>
          Registration list is empty!
        </div>
      )
    }
    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Department</th>
            <th>Position</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.state.registrationList.map( ( application, index )=>this.renderApplication( index, application ) )}
        </tbody>
      </table>
    )
  }
}

export default Registration