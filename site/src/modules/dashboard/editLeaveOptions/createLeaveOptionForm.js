import React from 'react'

import interactor from './interactor'

class CreateLeaveOptionForm extends React.Component {
  
  constructor( props ) {
    super( props )
    
    this.state={
      type: 'non accumulating'
    }

    this.submit = this.submit.bind( this )
  }


  submit() {
    const cb = ()=>{
      alert( 'Leave Option Created!' )
      this.props.onSuccess()
    }
    if( !this.state.name ) alert( 'Please Enter Leave Name' )
    if( !this.state.max ) alert( 'Please Enter Max holiday available' )
    if( !this.state.type ) alert( 'Please Enter Leave Type' )

    const data = {
      name: this.state.name,
      max: parseInt( this.state.max ),
      type: this.state.type,
    }

    interactor.createLeaveOption( data, cb )
  }
  
  render() {
    return (
      <div className='createLeaveForm-container'>
        <input placeholder='Leave Name' onChange={ (evt)=>this.setState({ name: evt.target.value }) } />
        <input placeholder='Max Leave allocated / year' onChange={ (evt)=>this.setState({ max: evt.target.value }) } />
        <select onChange={ evt=>this.setState({ type: evt.target.value }) } >
          <option value='Leave Type' disabled='disabled' selected='selected'>Leave Type</option>
          <option value='non accumulating'>Non Accumulating</option>
          <option value='accumulating'>Accumulating</option>
          <option value='non renewable'>Non Renewable</option>
        </select>
        <button onClick={ this.submit }>Submit</button>
      </div>
     )
  }

}

export default CreateLeaveOptionForm