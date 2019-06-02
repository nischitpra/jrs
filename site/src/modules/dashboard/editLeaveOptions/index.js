import React from 'react'


import CreateLeaveOptionForm from './createLeaveOptionForm'

import FloatingButton from '../../base/floatingButton'

import interactor from './interactor'

class EditLeaveOptions extends React.Component {
  
  constructor( props ) {
    super( props )
    this.state = {}
    
    this.init = this.init.bind( this )
    this.deleteOption = this.deleteOption.bind( this )
    this.renderLeaveOption = this.renderLeaveOption.bind( this )
  }

  componentWillMount() {
    this.init()
  }

  init() {
    const cb = ( data )=>{
      this.setState({ leaveOptions: data })
    }

    interactor.getLeaveOptions( cb )
  }

  deleteOption( optionId, index ) {
    const cb = ()=>{
      alert( 'Option deleted!' )
      this.state.leaveOptions.splice( index, 1 )
      this.forceUpdate()
    }
    interactor.deleteLeaveOption( { option_id: parseInt( optionId ) }, cb )
  }

  renderLeaveOption( option, index ) {
    return (
      <tr>
        <td>{ option.name }</td>
        <td>{ option.type }</td>
        <td>{ option.max }</td>
        <td>{ option.created_by_employee_name }</td>
        <td>
          <button onClick={ ()=>this.deleteOption( option.option_id, index ) } >Delete</button>
        </td>
      </tr>
    )
  }

  render() {
    if( !this.state.leaveOptions || !this.state.leaveOptions.length ) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <div className='editLeaveOptions-container'>
        <div className='title-container'>
          <div className='title'>
            Leave Options
          </div>
          <FloatingButton 
            icon='/icons/plus.svg'
            onClick={ ()=>{ window.modalManager.current.openModal( <CreateLeaveOptionForm onSuccess={ this.init }/> ) } }/>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Max Leaves allocate / Year</th>
              <th>Created by</th>
            </tr>
          </thead>
          <tbody>
            { this.state.leaveOptions.map( ( option, index )=>this.renderLeaveOption( option, index ) ) }
          </tbody>
        </table>
      </div>
    )
  }
}

export default EditLeaveOptions