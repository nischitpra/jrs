import React from 'react'

import interactor from './interactor'
import { api } from '../../../constants';

const moment = require('moment')

class EmployeeProfile extends React.Component {
  
  constructor( props ) {
    super( props )
    this.state = {}
  }

  componentWillMount() {
    const cb = ( data )=>{
      console.log( data )
      this.setState({
        ...data
      })
    }

    interactor.getApplicationDetails( this.props.form_id, cb )
  }
  renderMyBasicDetails() {
    return (
      <div className='form-container'>
        <div className='title'>My Basic Details</div>
        <div className='profile'><img src={ api.getUrl( `/getImage/profile?image=${ this.state.basicDetails.profile_image }` ) }/></div>
        <table>
          <tr><td><div className='label'>Name</div></td><td>{ this.state.basicDetails.name }</td></tr>
          <tr><td><div className='label'>Email</div></td><td>{ this.state.basicDetails.email }</td></tr>
          <tr><td><div className='label'>Gender</div></td><td>{ this.state.basicDetails.sex }</td></tr>
          <tr><td><div className='label'>DOB</div></td><td>{ moment( parseInt( this.state.basicDetails.date_of_birth ) ).format( 'D MMM, YYYY' ) }</td></tr>
          <tr><td><div className='label'>Blood Group</div></td><td>{ this.state.basicDetails.blood_group }</td></tr>
          <tr><td><div className='label'>Department</div></td><td>{ this.state.basicDetails.department }</td></tr>
          <tr><td><div className='label'>Position</div></td><td>{ this.state.basicDetails.position }</td></tr>
        </table>
      </div>
    )
  }

  renderFamilyDetails() {
    return (
      <div className='form-container'>
        <div className='title'>{ `Family Details` }</div>
        <table>
          <tr><td><div className='label'>Father</div></td><td>{ this.state.familyDetails.father_name }</td></tr>
          <tr><td><div className='label'>Mother</div></td><td>{ this.state.familyDetails.mother_name }</td></tr>
          <tr><td><div className='label'>Grandfather</div></td><td>{ this.state.familyDetails.grandfather_name }</td></tr>
          <tr><td><div className='label'>Spouse</div></td><td>{ this.state.familyDetails.spouse_name }</td></tr>
          </table>
          <div>
          <div className='form-container'>
            <div className='title'>{ `Children Details` }</div>
            <table>
            { this.state.childrenDetails.map( ( child,idx )=>
              <tr>
                <td><div className='label'>#{ idx }</div></td>
                <td>{ child.name }</td>
                <td>{ child.sex }</td>
              </tr>
            )}
            </table>
          </div>
          
        </div>
        
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
              <table>
                <tr><td><div className='label'>Province</div></td><td>{ this.state.addressDetails.province }</td></tr>
                <tr><td><div className='label'>District</div></td><td>{ this.state.addressDetails.district }</td></tr>
                <tr><td><div className='label'>City Type</div></td><td>{ this.state.addressDetails.city_type }</td></tr>
                <tr><td><div className='label'>Ward</div></td><td>{ this.state.addressDetails.ward }</td></tr>
                <tr><td><div className='label'>Block</div></td><td>{ this.state.addressDetails.block }</td></tr>
                <tr><td><div className='label'>Tole</div></td><td>{ this.state.addressDetails.tole }</td></tr>
                <tr><td><div className='label'>Is Permanent</div></td><td>{ this.state.addressDetails.is_current_address }</td></tr>
              </table>
              
              {
                this.state.addressDetails.is_current_address != 'y' && (
                  <table>
                    <tr><td><div className='label'>Province</div></td><td>{ this.state.addressDetails.permanent_province }</td></tr>
                    <tr><td><div className='label'>District</div></td><td>{ this.state.addressDetails.permanent_district }</td></tr>
                    <tr><td><div className='label'>City Type</div></td><td>{ this.state.addressDetails.permanent_city_type }</td></tr>
                    <tr><td><div className='label'>Ward</div></td><td>{ this.state.addressDetails.permanent_ward }</td></tr>
                    <tr><td><div className='label'>Block</div></td><td>{ this.state.addressDetails.permanent_block }</td></tr>
                    <tr><td><div className='label'>Tole</div></td><td>{ this.state.addressDetails.permanent_tole }</td></tr>
                  </table>
                )
              }
            </div>
          </div>      
      </div>
    )
  }

  renderCitizenshipDetails() {
    return (
      <div className='form-container'>
        <div className='title'>Citizenship Details</div>
        <table>
          <tr><td><div className='label'>Number</div></td><td>{ this.state.citizenshipDetails.citizenship_number }</td></tr>
          <tr><td><div className='label'>Issue Date</div></td><td>{ moment( parseInt( this.state.citizenshipDetails.citizenship_issue_date ) ).format( 'D MMM, YYYY' ) }</td></tr>
          <tr><td><div className='label'>Issue District</div></td><td>{ this.state.citizenshipDetails.citizenship_issue_district }</td></tr>
        </table>
      </div>
    )
  }

  renderEducationalDetails() {
    return (
      <div className='form-container'>
        <div className='title'>Education Details</div>
        <table>
        { 
          this.state.educationDetails.map( details=>
          <tr>
            <td><div className='label'>{ details.degree }</div></td>
            <td>{ details.institute_name}</td>
            <td>{ details.board }</td>
            <td>{ details.grades } / { details.total_marks }</td>
          </tr>  
        ) }
        </table>
      </div>
    )
  }

  
  renderPreviousJobDetails() {
    return (
      <div className='form-container'>
        <div className='title'>Previous Job Details</div>
        <table>
        {
          this.state.previousJobDetails.map( job=>
            <tr>
              <td><div className='label'>{ job.institute_name }</div></td>
              <td>{ job.designation }</td>
              <td>{ moment( parseInt( job.joining_date ) ).format( 'D MMM, YYYY' ) }</td>
              <td>{ job.period }</td>
            </tr>
          )
        }
        </table>
        
      </div>
    )
  }

  render() {
    if( !this.state.basicDetails || 
      !this.state.citizenshipDetails || 
      !this.state.addressDetails || 
      !this.state.familyDetails || 
      !this.state.educationDetails || 
      !this.state.previousJobDetails ) {
      return ( 
        <div>Loading...</div>
      )
    }
    return (
      <div className='employeeProfile-container'>
        <div className='subsection-container'>
          { this.renderMyBasicDetails() }
          { this.renderCitizenshipDetails() }
        </div>

        <div className='subsection-container'>
          { this.renderAddressDetails()}
          { this.renderPreviousJobDetails() } 
        </div>
        <div className='subsection-container'>
          { this.renderFamilyDetails() }
          { this.renderEducationalDetails() }
        </div>
      </div>
    )
  }
}

export default EmployeeProfile