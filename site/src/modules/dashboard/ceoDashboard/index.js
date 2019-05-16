import React from 'react'
import { Redirect } from "react-router-dom";

import interactor from './interactor'

export default class CeoDashboard extends React.Component {

  constructor( props ) {
    super( props )
    this.state = {}

    this.logout = this.logout.bind( this )
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

  logout() {
    this.setState({
      redirect: '/',
    })
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
    if( this.state.redirect ) {
      return <Redirect to={{ pathname: this.state.redirect }} />
    }
    
    return (
      <div>
        { this.renderEmployeeList() }
        <button onClick={ this.logout }>Logout</button>
      </div>
    )
  }
}