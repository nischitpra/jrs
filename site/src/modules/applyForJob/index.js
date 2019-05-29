import React from 'react'
import { Redirect } from "react-router-dom";

import interactor from './interactor'
import interactorDepartment from '../dashboard/editDepartmentOptions/interactor'
import interactorPosition from '../dashboard/editPositionOptions/interactor'

class ApplyForJob extends React.Component {
  
  constructor( props ) {
    super( props )

    this.state = {
      shouldRedirect: false,
    }
    this.onChangeText = this.onChangeText.bind( this )
    this.submit = this.submit.bind( this )
  }

  componentWillMount() {
    const cbDepartment = ( departmentOptions )=>{
      if( !departmentOptions || departmentOptions.length == 0 ) {
        departmentOptions = []
      }
      departmentOptions.push({ name: '*' })

      const renderDepartmentList = []
      for( var i in departmentOptions ) {
        renderDepartmentList.push( <option value={ departmentOptions[i].name }>{ departmentOptions[i].name }</option>)
      }
      this.setState({
        departmentOptions,
        renderDepartmentList,
        department: departmentOptions[0].name
      })
    }

    const cbPosition = ( positionOptions )=>{
      if( !positionOptions || positionOptions.length == 0 ) {
        return
      }
      const renderPositionList = []
      for( var i in positionOptions ) {
        renderPositionList.push( <option value={ positionOptions[i].name }>{ positionOptions[i].name }</option>)
      }
      this.setState({
        positionOptions,
        renderPositionList,
        position: positionOptions[0].name,
      })
    }


    interactorDepartment.getDepartmentOptions( cbDepartment )
    interactorPosition.getPositionOptions( cbPosition )
  }

  onChangeText( key, value ) {
    this.setState({ [key]: value })
  }

  submit() {
    
    if( !window.registrationList ) {
      window.registrationList = []
    }

    if( !this.state.name || !this.state.age || !this.state.sex || !this.state.position ) return alert( 'incomplete form details!' )

    const cb = ()=>{
      alert( 'form submited!' )
      this.setState({ shouldRedirect: true })
    }

    interactor.submitForm({
      name: this.state.name,
      email: this.state.email,
      age: parseInt( this.state.age ),
      sex: this.state.sex,
      department: this.state.department,
      position: this.state.position,
    }, cb )
  }

  render() {
    if( this.state.shouldRedirect ) {
      return (
        <Redirect to={{ pathname: "/" }} />
      )
    }

    if( !this.state.renderDepartmentList || this.state.renderDepartmentList.length == 0 || 
      !this.state.renderPositionList || this.state.renderPositionList.length == 0 ) {
      return (
        <div>Loading...</div>
      )
    } 

    return (
      <div>
        <input placeholder='Name' onChange={ evt=>this.onChangeText( 'name', evt.target.value ) } />
        <input placeholder='Email' onChange={ evt=>this.onChangeText( 'email', evt.target.value ) } />
        <input placeholder='Age' onChange={ evt=>this.onChangeText( 'age', evt.target.value ) } />
        <input placeholder='Sex' onChange={ evt=>this.onChangeText( 'sex', evt.target.value ) } />
        <select value={ this.state.department } onChange={ (evt)=>this.setState({ department: evt.target.value }) } >
          { this.state.renderDepartmentList }
        </select>
        <select value={ this.state.position } onChange={ (evt)=>this.setState({ position: evt.target.value }) } >
          { this.state.renderPositionList }
        </select>
        <button onClick={ this.submit }>Submit</button>
      </div>
    )
  }
}

export default ApplyForJob