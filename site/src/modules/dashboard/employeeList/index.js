import React from 'react'

import interactor from './interactor'
import EmployeeProfile from '../employeeProfile';

export default class EmployeeList extends React.Component {

  constructor( props ) {
    super( props )
    this.state = {}

    this.renderEmployee = this.renderEmployee.bind( this )
    this.renderEmployeeList = this.renderEmployeeList.bind( this )
  }

  componentWillMount() {
    const cb = ( data )=>{
      console.log( data )
      this.setState({
        employeeList: data 
      })
    }
    interactor.getEmployeeList( cb )
  }

  renderEmployee( employee ) {
    return (
      <tr onClick={ ()=>{ window.modalManager.current.openModal( <EmployeeProfile form_id={ employee.form_id }/> ) } }>
        <td>{ employee.employee_id }</td>
        <td>{ employee.form_id }</td>
        <td>{ employee.immediate_boss_employee_id }</td>
      </tr>
    )
  }
  renderEmployeeList() {
    if( !this.state.employeeList ) {
      return (
        <div>
          Employees List is Empty
        </div>
      )
    }
    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th># form</th>
            <th># boss</th>
          </tr>
        </thead>
        { this.state.employeeList.map( employee=>this.renderEmployee( employee ) ) }
      </table>
    )
  }
  render() {
    return (
      <div className='form-container'>
        <div className='title'>Employee List</div>
        { this.renderEmployeeList() }
      </div>
    )
  }
}