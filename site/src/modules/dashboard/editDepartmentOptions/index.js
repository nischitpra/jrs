import React from 'react'


import CreateDepartmentOptionForm from './createDepartmentOptionForm'

import FloatingButton from '../../base/floatingButton'

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
      <tr>
        <td>{ option.name }</td>
        <td>{ option.created_by_employee_name }</td>
        <td>
          <button onClick={ ()=>{ window.modalManager.current.openModal( 
            <CreateDepartmentOptionForm 
              onSuccess={ this.init } 
              isEdit={ true }
              name={ option.name }
              department_id={ option.department_id }
              /> 
          ) } }>Edit</button>
        </td>
      </tr>
    )
  }

  render() {
    if( !this.state.departmentOptions ) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <div className='editDepartmentOptions-container form-container'>
        <div className='title'>Department Options</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created by</th>
            </tr>
          </thead>
          <tbody>
            { this.state.departmentOptions.map( ( option, index )=>this.renderDepartmentOption( option, index ) ) }
          </tbody>
        </table>
        <FloatingButton 
            icon='/icons/plus.svg'
            onClick={ ()=>{ window.modalManager.current.openModal( <CreateDepartmentOptionForm onSuccess={ this.init } isEdit={ false }/> ) } }/>
      </div>
    )
  }
}

export default EditDepartmentOptions