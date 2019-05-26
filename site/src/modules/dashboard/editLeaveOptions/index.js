import React from 'react'


import CreateLeaveOptionForm from './createLeaveOptionForm'
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
      <div>
        name: { option.name },
        type: { option.type },
        max available per year: { option.max }
        created by: { option.created_by_employee_name }
        <button onClick={ ()=>this.deleteOption( option.option_id, index ) }>Delete</button>
      </div>
    )
  }

  render() {
    if( !this.state.leaveOptions || !this.state.leaveOptions.length ) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <div>
        <button onClick={ ()=>{ window.modalManager.current.openModal( <CreateLeaveOptionForm onSuccess={ this.init }/> ) } }>Add</button>
        { this.state.leaveOptions.map( ( option, index )=>this.renderLeaveOption( option, index ) ) }
      </div>
    )
  }
}

export default EditLeaveOptions