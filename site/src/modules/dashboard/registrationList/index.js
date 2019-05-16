import React from 'react'

import interactor from './interactor'

const positionLevel = [
  'CEO',
  'COO',
  'Manager',
  'Employee',
]

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
  
  approve( index ) {
    const cb = ()=>{
      this.state.registrationList.splice( index, 1 )
      this.forceUpdate()
      alert( 'Application approved!' )
    }
    interactor.approve( index, cb )
  }
  
  reject( index ) {
    const cb = ()=>{
      this.state.registrationList.splice( index, 1 )
      this.forceUpdate()
      alert( 'Application rejected!' )
    }
    interactor.reject( index, cb )
  } 

  renderApplication( index, application ) {
    return ( 
      <div>
        <input value={ application.name } />
        <input value={ application.age } />
        <input value={ application.sex } />
        <input value={ application.position } />
        <button onClick={ ()=>this.approve( index ) }>Approve</button>
        <button onClick={ ()=>this.reject( index ) }>Reject</button>
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