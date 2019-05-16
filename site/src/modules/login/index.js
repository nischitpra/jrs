import React from 'react'
import { Redirect } from "react-router-dom";

import interactor from './interactor'

export default class Login extends React.Component {

  constructor( props ) {
    super( props )
    
    this.state = {
      employeeId: '',
      password: '',
    }

    this.onChangeText = this.onChangeText.bind( this )
    this.login = this.login.bind( this )

  }

  onChangeText( key, text ) {
    this.setState({ [key]: text })
  }

  login() {
    const employeeId = this.state.employeeId
    const password = this.state.password
    interactor.login( employeeId, password, ( data )=>{
      this.setState({ redirect: <Redirect to={{ pathname:`/dashboard`, state:{ employeeId: employeeId, position: data.position } } } /> })
    })
  }


  render() {

    if( this.state.redirect ) {
      return this.state.redirect
    }
    
    return (
      <div>
        <input placeholder="Employee Id" onChange={ (evt)=>this.onChangeText( 'employeeId', evt.target.value ) }/>
        <input placeholder="Password" onChange={ (evt)=>this.onChangeText( 'password', evt.target.value ) }/>
        <button onClick={ ()=>this.login() }>Login</button>
        <br/>
        <button onClick={ ()=>this.setState({ redirect: <Redirect to={{ pathname:`/applyForJob` } } />  }) }>Apply for Job</button>
      </div>
    )
  }
}