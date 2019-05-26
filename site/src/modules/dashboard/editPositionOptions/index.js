import React from 'react'


import CreatePositionOptionForm from './createPositionOptionForm'
import interactor from './interactor'

class EditPositionOptions extends React.Component {
  
  constructor( props ) {
    super( props )
    this.state = {}
    
    this.init = this.init.bind( this )
    this.editOption = this.editOption.bind( this )
    this.renderPositionOption = this.renderPositionOption.bind( this )
  }

  componentWillMount() {
    this.init()
  }

  init() {
    const cb = ( data )=>{
      this.setState({ positionOptions: data })
    }

    interactor.getPositionOptions( cb )
  }

  editOption( positionId, index ) {
    const cb = ()=>{
      alert( 'Option edited!' )
      this.state.positionOptions.splice( index, 1 )
      this.forceUpdate()
    }
    interactor.editPositionOption( { position_id: parseInt( positionId ) }, cb )
  }

  renderPositionOption( option, index ) {
    return (
      <div>
        name: { option.name },
        position_level: { option.position_level },
        department: { option.department }
        created by: { option.created_by_employee_name }
        <button onClick={ ()=>{ window.modalManager.current.openModal( 
          <CreatePositionOptionForm 
            onSuccess={ this.init } 
            isEdit={ true }
            name={ option.name }
            position_level={ option.position_level }
            department={ option.department }
            position_id={ option.position_id }
            /> 
        ) } }>Edit</button>
      </div>
    )
  }

  render() {
    if( !this.state.positionOptions || !this.state.positionOptions.length ) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <div>
        <button onClick={ ()=>{ window.modalManager.current.openModal( <CreatePositionOptionForm onSuccess={ this.init } isEdit={ false }/> ) } }>Add</button>
        { this.state.positionOptions.map( ( option, index )=>this.renderPositionOption( option, index ) ) }
      </div>
    )
  }
}

export default EditPositionOptions