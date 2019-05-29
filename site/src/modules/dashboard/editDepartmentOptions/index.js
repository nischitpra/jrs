import React from 'react'


import CreateDepartmentOptionForm from './createDepartmentOptionForm'
import interactor from './interactor'

class EditDepartmentOptions extends React.Component {
  
  constructor( props ) {
    super( props )
    this.state = {}
    
    this.init = this.init.bind( this )
    this.editOption = this.editOption.bind( this )
    this.renderDepartmentOption = this.renderDepartmentOption.bind( this )
  }

  componentWillMount() {
    this.init()
  }

  init() {
    const cb = ( data )=>{
      this.setState({ departmentOptions: data })
    }

    interactor.getDepartmentOptions( cb )
  }

  editOption( departmentId, index ) {
    const cb = ()=>{
      alert( 'Option edited!' )
      this.state.departmentOptions.splice( index, 1 )
      this.forceUpdate()
    }
    interactor.editDepartmentOption( { department_id: parseInt( departmentId ) }, cb )
  }

  renderDepartmentOption( option, index ) {
    return (
      <div>
        name: { option.name },
        created by: { option.created_by_employee_name }
        <button onClick={ ()=>{ window.modalManager.current.openModal( 
          <CreateDepartmentOptionForm 
            onSuccess={ this.init } 
            isEdit={ true }
            name={ option.name }
            department_id={ option.department_id }
            /> 
        ) } }>Edit</button>
      </div>
    )
  }

  render() {
    if( !this.state.departmentOptions || !this.state.departmentOptions.length ) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <div>
        <button onClick={ ()=>{ window.modalManager.current.openModal( <CreateDepartmentOptionForm onSuccess={ this.init } isEdit={ false }/> ) } }>Add</button>
        { this.state.departmentOptions.map( ( option, index )=>this.renderDepartmentOption( option, index ) ) }
      </div>
    )
  }
}

export default EditDepartmentOptions