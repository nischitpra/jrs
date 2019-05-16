import React from 'react'

import interactor from './interactor'

export default class EmployeeList extends React.Component {

  constructor( props ) {
    super( props )
    this.state = {}

    this.renderEmployee = this.renderEmployee.bind( this )
    this.renderEmployeeList = this.renderEmployeeList.bind( this )
  }

  componentWillMount() {
    const cb = ( data )=>{
      this.setState({
        employeeList: data 
      })
    }
    interactor.getEmployeeList( cb )
  }

  renderEmployee( employee ) {
    return (
      <div>
        Name: { employee.name }<br/>
        Age: { employee.age }<br/>
        Sex: { employee.sex }<br/>
        Position: { employee.position }<br/>
        Immediate Boss: { employee.immediateBoss }<br/><br/>
      </div>
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
      <div>
        {
          Object.keys( this.state.employeeList ).map( key=>{
            return this.state.employeeList[key].map( employee=>{
              return this.renderEmployee( employee )
            })
          })
        }
      </div>
    )
  }
  render() {
    return (
      <div>
        { this.renderEmployeeList() }
      </div>
    )
  }
}