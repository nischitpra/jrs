import React from 'react'

import interactor from './interactor'

class CreateDepartmentOptionForm extends React.Component {
  
  constructor( props ) {
    super( props )
    
    this.state={
      name: this.props.name || '',
      department_id: this.props.department_id || '',
    }

    this.submit = this.submit.bind( this )
  }


  submit() {
    const cb = ()=>{
      alert( `Department Option ${ this.props.isEdit? 'Updated' : 'Created' }!` )
      this.props.onSuccess()
    }

    const data = {
      name: this.state.name,
      department: this.state.department,
      department_id: parseInt( this.state.department_id ),
    }
    if( this.props.isEdit ) {
      interactor.editDepartmentOption( data, cb )
    }
    else {
      interactor.createDepartmentOption( data, cb )
    }
  }
  
  render() {
    return (
      <div className='createDepartmentForm-container'>
          <input value={this.state.name} placeholder='Department Name' onChange={ (evt)=>this.setState({ name: evt.target.value }) } />
          <button onClick={ this.submit }>{ this.props.isEdit? 'Update' : 'Submit' }</button>
      </div>
     )
  }

}

export default CreateDepartmentOptionForm