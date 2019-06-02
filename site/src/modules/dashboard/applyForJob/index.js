import React from 'react'
import { Redirect } from "react-router-dom";

import interactor from './interactor'
import interactorDepartment from '../editDepartmentOptions/interactor'
import interactorPosition from '../editPositionOptions/interactor'
import UploadPhoto from '../../base/uploadPhoto';

import FloatingButton from '../../base/floatingButton'

class ApplyForJob extends React.Component {
  
  constructor( props ) {
    super( props )

    this.state = {
      shouldRedirect: false,
    }
    this.onChangeText = this.onChangeText.bind( this )
    this.submit = this.submit.bind( this )


    this.renderGenderSelector = this.renderGenderSelector.bind( this )
    this.renderMyBasicDetails = this.renderMyBasicDetails.bind( this )
    this.renderFamilyDetails = this.renderFamilyDetails.bind( this )
    this.renderChildrenDetails = this.renderChildrenDetails.bind( this )
    this.renderAddressDetails = this.renderAddressDetails.bind( this )
    this.renderCitizenshipDetails = this.renderCitizenshipDetails.bind( this )
    this.renderEducationalDetails = this.renderEducationalDetails.bind( this )
    this.renderPreviousJobDetails = this.renderPreviousJobDetails.bind( this )
    this.renderCurrentApplciationDetails = this.renderCurrentApplciationDetails.bind( this )
  }

  componentWillMount() {
    const cbDepartment = ( departmentOptions )=>{
      if( !departmentOptions || departmentOptions.length == 0 ) {
        departmentOptions = []
      }
      departmentOptions.push({ name: '*' })

      const renderDepartmentList = []
      for( var i in departmentOptions ) {
        renderDepartmentList.push( <option value={ departmentOptions[i].name }>{ departmentOptions[i].name }</option> )
      }
      renderDepartmentList.unshift( <option value='department' disabled={ true } selected="selected">Select Department</option> )
      this.setState({
        departmentOptions,
        renderDepartmentList,
        // department: departmentOptions[0].name
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
      renderPositionList.unshift( <option value='position' disabled={ true } selected="selected">Select Position</option> )
      this.setState({
        positionOptions,
        renderPositionList,
        // position: positionOptions[0].name,
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

  renderGenderSelector( key ) {
    return (
      <select onChange={ evt=>this.onChangeText( key, evt.target.value ) } >
        <option value='gender' disabled='disabled' selected='selected' >Gender</option>
        <option value='m'>Male</option>
        <option value='f'>Female</option>
        <option value='o'>Others</option>
      </select>
    )
  }

  renderMyBasicDetails() {
    return (
      <div className='form-container'>
        <div className='title'>My Basic Details</div>
        <input placeholder='Name' onChange={ evt=>this.onChangeText( 'name', evt.target.value ) } />
        <input placeholder='Email' onChange={ evt=>this.onChangeText( 'email', evt.target.value ) } />
        { this.renderGenderSelector( 'sex' ) }
        <input placeholder='Date of Birth' type='date' onChange={ evt=>this.onChangeText( 'dateOfBirth', evt.target.value ) } />
        <select placeholder='Blood Group' onChange={ evt=>this.onChangeText( 'bloodGroup', evt.target.value ) } >
          <option value='select blood group' disabled='disabled' selected='selected'>Blood Group</option>
          <option value='A+'>A+</option>
          <option value='A-'>A-</option>
          <option value='B+'>B+</option>
          <option value='B-'>B-</option>
          <option value='AB+'>AB+</option>
          <option value='AB-'>AB-</option>
          <option value='O+'>O+</option>
          <option value='O-'>O-</option>
        </select>
      </div>
    )
  }

  renderFamilyDetails() {
    return (
      <div className='form-container'>
        <div className='title'>{ `Family Details` }</div>
        <input placeholder={ `Father\s Name` } onChange={ evt=>this.onChangeText( `fatherName`, evt.target.value ) } />
        <input placeholder={ `Mother\s Name` } onChange={ evt=>this.onChangeText( `motherName`, evt.target.value ) } />
        <input placeholder={ `Grandfather\s Name` } onChange={ evt=>this.onChangeText( `grandfatherName`, evt.target.value ) } />
        <input placeholder={ `Spouse\s Name` } onChange={ evt=>this.onChangeText( `spouseName`, evt.target.value ) } />
        { this.renderChildrenDetails() }
      </div>
    )
  }
  
  renderChildrenDetails() {
    return (
      <div className='form-container'>
        <div className='title'>Children's Details</div>
        <input type='number' placeholder="Number of Children" onChange={ evt=>this.onChangeText( 'numberOfChildren', evt.target.value ) } />
        {
          parseInt( this.state.numberOfChildren ) > 0 
          && Array( Math.min( parseInt( this.state.numberOfChildren ), 20 ) ).fill( '1' ).map( ( _,idx )=>
            <div className='form-container' key={ idx } >
              <div className='title'>#{ idx + 1 }</div>
              <input placeholder='Name' onChange={ evt=>this.onChangeText( `nameOfChildren${ idx }`, evt.target.value ) } />
              { this.renderGenderSelector( `childrenSex${ idx }` ) }
            </div>
          )
        }
      </div>
    )
  }

  renderAddressDetails() {
    return (
      <div className='form-container'>
        <div className='title'>Address Details</div>
        <div className='subsection-container'>
          <div className='form-container'>
              <div className='title'>Current Address</div>
              <input placeholder='Province' onChange={ evt=>this.onChangeText( 'province', evt.target.value ) }  />
              <input placeholder='District' onChange={ evt=>this.onChangeText( 'district', evt.target.value ) }  />
              <select onChange={ evt=>this.onChangeText( 'cityType', evt.target.value ) }  >
                <option value='city type' disabled="disabled" selected="selected">City Type</option>
                <option value='metropolitan'>Metropolitan</option>
                <option value='submetropolitan'>Sub-metropolitan</option>
                <option value='Municipality'>Municipality</option>
                <option value='village'>Village</option>
              </select>
              <input placeholder='Ward Number' onChange={ evt=>this.onChangeText( 'ward', evt.target.value ) }  />
              <input placeholder='Block Number' onChange={ evt=>this.onChangeText( 'block', evt.target.value ) }  />
              <input placeholder='Tole' onChange={ evt=>this.onChangeText( 'tole', evt.target.value ) }  />
            </div>

            <div className='form-container'>
              <div className='title'>Permanent Address</div>
              <select onChange={ evt=>this.onChangeText( 'isCurrentAddress', evt.target.value ) }  >
                <option value='is current address' disabled="disabled" selected="selected">Same as Current Address?</option>
                <option value='y'>Yes</option>
                <option value='n'>No</option>
              </select>
              { this.state.isCurrentAddress != 'y' && (
                <div>
                  <input placeholder='Province' onChange={ evt=>this.onChangeText( 'permanentProvince', evt.target.value ) }  />
                  <input placeholder='District' onChange={ evt=>this.onChangeText( 'permanentDistrict', evt.target.value ) }  />
                  <select onChange={ evt=>this.onChangeText( 'permanentCityType', evt.target.value ) }  >
                    <option value='city type' disabled="disabled" selected="selected">City Type</option>
                    <option value='metropolitan'>Metropolitan</option>
                    <option value='submetropolitan'>Sub-metropolitan</option>
                    <option value='Municipality'>Municipality</option>
                    <option value='village'>Village</option>
                  </select>
                  <input placeholder='Ward Number' onChange={ evt=>this.onChangeText( 'permanentWard', evt.target.value ) }  />
                  <input placeholder='Block Number' onChange={ evt=>this.onChangeText( 'permanentBlock', evt.target.value ) }  />
                  <input placeholder='Tole' onChange={ evt=>this.onChangeText( 'permanentTole', evt.target.value ) }  />
                </div>
              ) }
            </div>
          </div>      
      </div>
    )
  }

  renderCitizenshipDetails() {
    return (
      <div className='form-container'>
        <div className='title'>Citizenship Details</div>
        <input placeholder='Citizenship Number' onChange={ evt=>this.onChangeText( 'citizenshipNumber', evt.target.value ) } />
        <input placeholder='Issue Date' type='date' onChange={ evt=>this.onChangeText( 'citizenshipIssueDate', evt.target.value ) } />
        <input placeholder='Issue District' onChange={ evt=>this.onChangeText( 'citizenshipIssueDistrict', evt.target.value ) } />
      </div>
    )
  }

  renderEducationalDetails() {

    const renderRows = ( displayName, key )=>{
      return (
        <div className='form-container'>
          <div className='title'>{ displayName }</div>
          <div><input placeholder='Institute Name' onChange={ evt=>this.onChangeText( `${ key }InstituteName`, evt.target.value ) } /></div>
          <div><input placeholder='Board' onChange={ evt=>this.onChangeText( `${ key }Board`, evt.target.value ) } /></div>
          <div><input placeholder='Total Marks (%)' onChange={ evt=>this.onChangeText( `${ key }TotalMarks`, evt.target.value ) } /></div>
          <div><input placeholder='Grades' onChange={ evt=>this.onChangeText( `${ key }Grades`, evt.target.value ) } /></div>
        </div>
      )
    }
    return (
      <div className='form-container'>
        <div className='title'>Education Details</div>
        <select onChange={ evt=>this.onChangeText( 'highestLevelOfStudy', evt.target.value ) }  >
          <option value='highest level of stupd' disabled="disabled" selected="selected">Highest Level of Study</option>
          <option value='0'>SLC / SEE</option>
          <option value='1'>Highschool</option>
          <option value='2'>Bachelors</option>
          <option value='3'>Masters</option>
        </select>

        { this.state.highestLevelOfStudy >= 0 && renderRows( 'SLC / SEE', 'slc' ) }
        { this.state.highestLevelOfStudy >= 1 && renderRows( 'Highschool', 'highschool' ) }
        { this.state.highestLevelOfStudy >= 2 && renderRows( 'Bachelors', 'bachelors' ) }
        { this.state.highestLevelOfStudy >= 3 && renderRows( 'Masters', 'masters' ) }
      </div>
    )
  }

  renderPreviousJobDetails() {

    const renderRows = ( displayName, key )=>{
      return (
        <div className='form-container'>
          <div className='title'>{ displayName }</div>
          <div><input placeholder='Institute Name' onChange={ evt=>this.onChangeText( `previousJobInstituteName${ key }`, evt.target.value ) } /></div>
          <div><input placeholder='Designation' onChange={ evt=>this.onChangeText( `previousJobDesignation${ key }`, evt.target.value ) } /></div>
          <div><input placeholder='Joining Date' type='date' onChange={ evt=>this.onChangeText( `previousJobJoiningDate${ key }`, evt.target.value ) } /></div>
          <div><input placeholder='Period' onChange={ evt=>this.onChangeText( `previousJobPeriod${ key }`, evt.target.value ) } /></div>
        </div>
      )
    }
    return (
      <div className='form-container'>
        <div className='title'>Previous Job Details</div>
        <input placeholder='Number of Previous Jobs' onChange={ evt=>this.onChangeText( 'numberOfPreviousJobs', evt.target.value ) } />
        {
          parseInt( this.state.numberOfPreviousJobs ) > 0 
          && (
            Array( parseInt( this.state.numberOfPreviousJobs ) ).fill( '1' ).map( ( _, idx )=> renderRows( `#${ ( idx + 1 ) }`, idx ))
          )
        }
      </div>
    )
  }

  renderCurrentApplciationDetails() {
    return (
      <div className='form-container'>
        <div className='title'>Current Placement</div>
        <select value={ this.state.department } onChange={ (evt)=>this.setState({ department: evt.target.value }) } >
          { this.state.renderDepartmentList }
        </select>
        <select value={ this.state.position } onChange={ (evt)=>this.setState({ position: evt.target.value }) } >
          { this.state.renderPositionList }
        </select>
        <UploadPhoto api='/uploadFile/profile' imgKey='profile' btnText='Upload Passport Size Photograph'
          onSuccess={ imageName=>this.setState({ profileImage: imageName }) } />
      </div>  
    )
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
      <div className='applyForJob-container'>
        <div className='subsection-container'>
          { this.renderMyBasicDetails() }
          { this.renderCitizenshipDetails() }
        </div>

        <div className='subsection-container'>
          { this.renderAddressDetails()}
        </div>
        <div className='subsection-container'>
          { this.renderFamilyDetails() }
          { this.renderEducationalDetails() }
        </div>
        <div className='subsection-contianer'>
          <div className='form-container'>
            <div className='title'>Job Details</div>
            <div className='subsection-container'>
              { this.renderPreviousJobDetails() } 
              { this.renderCurrentApplciationDetails() }
            </div>
          </div>
        </div>
        <label>
          <div className='declaration-container'>
            <input type='checkbox' value='sign' onChange={ (evt)=>this.setState({ sign: evt.target.checked }) }/>
            <span>
              <b>Declaration:</b> I hereby declare that the details furnished above are true and correct to the best of my knowledge
      and belief and I undertake to inform you of any changes therein, immediately. In case any of the above
      information is found to be false or untrue or misleading or misrepresenting, I am aware that I may be held liable
      for it and the company may take disciplinary actions against me.
            </span>
          </div>
        </label> 
        <FloatingButton onClick={ this.submit } disabled={ !this.state.sign } icon='/icons/right_arrow.svg'/>
      </div>
    )
  }
}

export default ApplyForJob