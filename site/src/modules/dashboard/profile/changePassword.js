import React from 'react'
import interactor from './interactor'

class ChangePassword extends React.Component {
  constructor( props ) {
    super( props )

    this.submit = this.submit.bind( this )
  }

  submit() {
    const cb = ()=>{
      alert( 'Password has been updated.' )
    }

    if( !this.state.oldPassword ) return alert( 'Please enter your Old password.' )
    if( !this.state.newPassword ) return alert( 'Please enter a new password.' )
    if( this.state.newPassword != this.state.confirmPassword ) return alert( 'Please confirm your new Password.' )

    return interactor.changePassword( this.state.oldPassword, this.state.newPassword, cb )
  }

  render() {
    return (
      <div>
        <input placeholder='Old Password' onChange={ (evt)=>{ this.setState({ oldPassword: evt.target.value }) } } />
        <input placeholder='New Password' onChange={ (evt)=>{ this.setState({ newPassword: evt.target.value }) } } />
        <input placeholder='Confirm New Password' onChange={ (evt)=>{ this.setState({ confirmPassword: evt.target.value }) } } />
        <button onClick={ this.submit}>Submit</button>
      </div>
    )
  }
}

export default ChangePassword