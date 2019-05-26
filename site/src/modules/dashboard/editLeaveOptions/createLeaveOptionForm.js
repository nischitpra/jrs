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

    const data = {
      name: this.state.name,
      max: parseInt( this.state.max ),
      type: this.state.type,
    }

    interactor.createLeaveOption( data, cb )
  }
  
  render() {
    return (
      <div>
        <input placeholder='name' onChange={ (evt)=>this.setState({ name: evt.target.value }) } />
        <input placeholder='max' onChange={ (evt)=>this.setState({ max: evt.target.value }) } />
        <select onChange={ evt=>this.setState({ type: evt.target.value }) } >
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