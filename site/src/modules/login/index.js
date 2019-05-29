import React from 'react'
import { Redirect } from "react-router-dom";

import IconInput from '../base/iconInput'


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
    const employeeId = parseInt( this.state.employeeId )
    const password = this.state.password
    interactor.login( employeeId, password, ( data )=>{
      window.user = {
        employeeId: employeeId,
      }
      this.setState({ redirect: <Redirect to={{ pathname:`/dashboard` }} /> })
    })
  }


  render() {

    if( this.state.redirect ) {
      return this.state.redirect
    }
    
    return (
      <div className='login-container'>
        <div className='content'>
          <div>
            <IconInput placeholder="Employee Id" onChange={ (evt)=>this.onChangeText( 'employeeId', evt.target.value ) }/>
            <IconInput placeholder="Password" onChange={ (evt)=>this.onChangeText( 'password', evt.target.value ) } type='password' />
          </div>
          <button onClick={ ()=>this.login() }>Login</button>
          {/* <button onClick={ ()=>this.setState({ redirect: <Redirect to={{ pathname:`/applyForJob` } } />  }) }>Apply for Job</button> */}
        </div>
      </div>
    )
  }
}