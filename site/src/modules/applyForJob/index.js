import React from 'react'
import { Redirect } from "react-router-dom";

import interactor from './interactor'

class ApplyForJob extends React.Component {
  
  constructor( props ) {
    super( props )

    this.state = {
      shouldRedirect: false,
    }
    this.onChangeText = this.onChangeText.bind( this )
    this.submit = this.submit.bind( this )
  }

  onChangeText( key, value ) {
    this.setState({ [key]: value })
  }

  submit() {
    
    if( !window.registrationList ) {
      window.registrationList = []
    }

    if( !this.state.name || !this.state.age || !this.state.sex || !this.state.position ) return alert( 'incomplete form details!' )

    const cb = ()=>{
      alert( 'form submited!' )
      this.setState({ shouldRedirect: true })
    }

    interactor.submitForm({
      name: this.state.name,
      age: this.state.age,
      sex: this.state.sex,
      position: this.state.position,
    }, cb )
  }

  render() {
    if( this.state.shouldRedirect ) {
      return (
        <Redirect to={{ pathname: "/" }} />
      )
    }

    return (
      <div>
        <input placeholder='Name' onChange={ evt=>this.onChangeText( 'name', evt.target.value ) } />
        <input placeholder='Age' onChange={ evt=>this.onChangeText( 'age', evt.target.value ) } />
        <input placeholder='Sex' onChange={ evt=>this.onChangeText( 'sex', evt.target.value ) } />
        <input placeholder='Position' onChange={ evt=>this.onChangeText( 'position', evt.target.value ) } />
        <button onClick={ this.submit }>Submit</button>
      </div>
    )
  }
}

export default ApplyForJob