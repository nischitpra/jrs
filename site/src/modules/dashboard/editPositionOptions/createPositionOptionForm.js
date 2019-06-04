import React from 'react'

import interactor from './interactor'
import interactorDepartment from '../editDepartmentOptions/interactor'

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

  componentWillMount() {
    const cb = ( departmentOptions )=>{
      if( !departmentOptions || departmentOptions.length == 0 ) {
        departmentOptions = []
      }
      // departmentOptions.push({ name: '*' })
      const renderDepartmentList = []
      for( var i in departmentOptions ) {
        renderDepartmentList.push( <option value={ departmentOptions[i].name }>{ departmentOptions[i].name }</option> )
      }
      renderDepartmentList.unshift( <option value='department' disabled={ true } selected="selected">Department</option> )
      this.setState({
        departmentOptions,
        renderDepartmentList,
        // department: departmentOptions[0].name
      })
    }
    interactorDepartment.getDepartmentOptions( cb )
  }


  submit() {
    const cb = ()=>{
      alert( `Position Option ${ this.props.isEdit? 'Updated' : 'Created' }!` )
      this.props.onSuccess()
    }

    if( !this.state.name ) return alert( 'Please enter Position Name' )
    if( !this.state.position_level ) return alert( 'Please enter Position Level' )
    if( !this.state.department ) return alert( 'Please select Department' )

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
    if( !this.state.renderDepartmentList || this.state.renderDepartmentList.length == 0 ) {
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div className='createPositionForm-container'>
        <input value={this.state.name} placeholder='Position Name' onChange={ (evt)=>this.setState({ name: evt.target.value }) } />
        <input value={this.state.position_level} placeholder='Position Level' onChange={ (evt)=>this.setState({ position_level: evt.target.value }) } />
        <select onChange={ (evt)=>this.setState({ department: evt.target.value }) } >
          { this.state.renderDepartmentList }
        </select>
        <button onClick={ this.submit }>{ this.props.isEdit? 'Update' : 'Submit' }</button>
      </div>
     )
  }

}

export default CreatePositionOptionForm