import React from 'react'

import interactor from './interactor'

class CreatePositionOptionForm extends React.Component {
  
  constructor( props ) {
    super( props )
    
    this.state={
      name: this.props.name || '',
      position_level: this.props.position_level || '',
      department: this.props.department || '',
      position_id: this.props.position_id || '',
    }

    this.submit = this.submit.bind( this )
  }


  submit() {
    const cb = ()=>{
      alert( `Position Option ${ this.props.isEdit? 'Updated' : 'Created' }!` )
      this.props.onSuccess()
    }

    const data = {
      name: this.state.name,
      position_level: parseInt( this.state.position_level ),
      department: this.state.department,
      position_id: parseInt( this.state.position_id ),
    }
    if( this.props.isEdit ) {
      interactor.editPositionOption( data, cb )
    }
    else {
      interactor.createPositionOption( data, cb )
    }
  }
  
  render() {
    return (
      <div>
        <input value={this.state.name} placeholder='name' onChange={ (evt)=>this.setState({ name: evt.target.value }) } />
        <input value={this.state.position_level} placeholder='position_level' onChange={ (evt)=>this.setState({ position_level: evt.target.value }) } />
        <input value={this.state.department} placeholder='department' onChange={ (evt)=>this.setState({ department: evt.target.value }) } />
        <button onClick={ this.submit }>{ this.props.isEdit? 'Update' : 'Submit' }</button>
      </div>
     )
  }

}

export default CreatePositionOptionForm