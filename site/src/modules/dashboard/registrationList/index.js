import React from 'react'

import interactor from './interactor'

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
      <div>
        <input value={ application.name } />
        <input value={ application.email } />
        <input value={ application.age } />
        <input value={ application.sex } />
        <input value={ application.department } />
        <input value={ application.position } />
        <button onClick={ ()=>this.approve( application.form_id, index ) }>Approve</button>
        <button onClick={ ()=>this.reject( application.form_id, index ) }>Reject</button>
      </div>
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
      <div>
        { this.state.registrationList.map( ( application, index )=>this.renderApplication( index, application ) )}
      </div>
    )
  }
}

export default Registration