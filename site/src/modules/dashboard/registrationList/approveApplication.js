import React from 'react'

import ApplyForJob from '../applyForJob'
import interactor from './interactor';

const moment = require('moment')

class ApproveApplication extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {}
  }
  componentWillMount() {
    //fetch data for form
    const cb = (data)=>{
      const formattedData = this.formatData( data )
      this.setState({
        data: formattedData
      })
    }

    interactor.getApplicationDetails( this.props.formId, cb )
  }

  formatData( application ) {
    const data = {
      name: application.basicDetails.name,
      email: application.basicDetails.email,
      sex: application.basicDetails.sex,
      dateOfBirth: moment( parseInt( application.basicDetails.date_of_birth ) ).format( 'YYYY-MM-DD' ),
      bloodGroup: application.basicDetails.blood_group,
      department: application.basicDetails.department,
      position: application.basicDetails.position,
      profileImage: application.basicDetails.profile_image,

      citizenshipNumber: application.citizenshipDetails.citizenship_number,
      citizenshipIssueDate: moment( parseInt( application.citizenshipDetails.citizenship_issue_date ) ).format( 'YYYY-MM-DD' ),
      citizenshipIssueDistrict: application.citizenshipDetails.citizenship_issue_district,
      
      province: application.addressDetails.province,
      district: application.addressDetails.district,
      cityType: application.addressDetails.city_type,
      ward: application.addressDetails.ward,
      block: application.addressDetails.block,
      tole: application.addressDetails.tole,
      isCurrentAddress: application.addressDetails.is_current_address,
      permanentProvince: application.addressDetails.permanent_province,
      permanentDistrict: application.addressDetails.permanent_district,
      permanentCityType: application.addressDetails.permanent_city_type,
      permanentWard: application.addressDetails.permanent_ward,
      permanentBlock: application.addressDetails.permanent_block,
      permanentTole: application.addressDetails.permanent_tole,

      fatherName: application.familyDetails.father_name,
      motherName: application.familyDetails.mother_name,
      grandfatherName: application.familyDetails.grandfather_name,
      spouseName: application.familyDetails.spouse_name,
      numberOfChildren: application.familyDetails.number_of_children,

      highestLevelOfStudy: application.educationDetails.length - 1,
      numberOfPreviousJobs: application.previousJobDetails.length,
    }
   
    for( var i in application.childrenDetails ) {
      data[`nameOfChildren${ i }`] = application.childrenDetails[i].name
      data[`childrenSex${ i }`] = application.childrenDetails[i].sex
    }
    
    for( var i in application.educationDetails ) {
      data[`${application.educationDetails[i].degree}InstituteName`] = application.educationDetails[i].institute_name
      data[`${application.educationDetails[i].degree}Board`] = application.educationDetails[i].board
      data[`${application.educationDetails[i].degree}TotalMarks`] = application.educationDetails[i].total_marks
      data[`${application.educationDetails[i].degree}Grades`] = application.educationDetails[i].grades
    }


    for( var i in application.previousJobDetails ) {
      data[`previousJobInstituteName${ i }`] = application.previousJobDetails[i].institute_name
      data[`previousJobDesignation${ i }`] = application.previousJobDetails[i].designation
      data[`previousJobJoiningDate${ i }`] = moment( parseInt( application.previousJobDetails[i].joining_date ) ).format( 'YYYY-MM-DD' )
      data[`previousJobPeriod${ i }`] = application.previousJobDetails[i].period
    }
  
    return data
  }

  render() {
    return (
      <div className='approveApplication-container'>
        <ApplyForJob isApproval={true} data={ this.state.data } />
        <button onClick={ this.props.approve }>Approve</button>
        <button onClick={ this.props.reject }>Reject</button>
      </div>
    )
  }
}

export default ApproveApplication