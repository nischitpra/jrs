import { sendRequest } from '../../../helper/httpHelper'

const submitForm = ( application, cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not submit Form',
      cb: ()=>{},
    }
  }

  sendRequest( 'post', '/employeeForm', formatApplication( application ), helper )
}

const formatApplication = ( application )=>{
  const basicDetails = {
    name: application.name,
    email: application.email,
    sex: application.sex,
    date_of_birth: new Date( application.dateOfBirth ).getTime(),
    blood_group: application.bloodGroup,
    department: application.department,
    position: application.position,
    profile_image: application.profileImage,
  }
  const citizenshipDetails = {
    citizenship_number: parseInt( application.citizenshipNumber ),
    citizenship_issue_date: new Date( application.citizenshipIssueDate ).getTime(),
    citizenship_issue_district: application.citizenshipIssueDistrict,
  }
  const addressDetails = {
    province: application.province,
    district: application.district,
    city_type: application.cityType,
    ward: parseInt( application.ward ),
    block: application.block,
    tole: application.tole,
    is_current_address: application.isCurrentAddress,
  }
  if( application.isCurrentAddress != 'y' ) {
    addressDetails.permanent_province = application.permanentProvince
    addressDetails.permanent_district = application.permanentDistrict
    addressDetails.permanent_city_type = application.permanentCityType
    addressDetails.permanent_ward = parseInt( application.permanentWard )
    addressDetails.permanent_block = application.permanentBlock
    addressDetails.permanent_tole = application.permanentTole
  }
  const familyDetails = {
    father_name: application.fatherName,
    mother_name: application.motherName,
    grandfather_name: application.grandfatherName,
    spouse_name: application.spouseName,
    number_of_children: parseInt( application.numberOfChildren ),
  }
  const childrenDetails = []
  for( var i = 0; i < application.numberOfChildren; i++ ) {
    const childDetail = {
      name: application[`nameOfChildren${ i }`],
      sex: application[`childrenSex${ i }`],
    }
    childrenDetails.push( childDetail )
  }
  const educationDetails = []
  switch( parseInt( application.highestLevelOfStudy ) ) {
    case 3: //masters
      educationDetails.push({
        degree: 'masters',
        institute_name: application.mastersInstituteName,
        board: application.mastersBoard,
        total_marks: parseInt( application.mastersTotalMarks ),
        grades: parseInt( application.mastersGrades )
      })
    case 2: //bachelors
      educationDetails.push({
        degree: 'bachelors',
        institute_name: application.bachelorsInstituteName,
        board: application.bachelorsBoard,
        total_marks: parseInt( application.bachelorsTotalMarks ),
        grades: parseInt( application.bachelorsGrades )
      })
    case 1: //+2
      educationDetails.push({
        degree: 'highschool',
        institute_name: application.highschoolInstituteName,
        board: application.highschoolBoard,
        total_marks: parseInt( application.highschoolTotalMarks ),
        grades: parseInt( application.highschoolGrades )
      })
    case 0: //slc
      educationDetails.push({
        degree: 'slc',
        institute_name: application.slcInstituteName,
        board: application.slcBoard,
        total_marks: parseInt( application.slcTotalMarks ),
        grades: parseInt( application.slcGrades )
      })
  }
  const previousJobDetails = []
  for( var i = 0; i < application.numberOfPreviousJobs; i++ ) {
    previousJobDetails.push({
      institute_name: application[`previousJobInstituteName${ i }`],
      designation: application[`previousJobDesignation${ i }`],
      joining_date: new Date( application[`previousJobJoiningDate${ i }`] ).getTime(),
      period: application[`previousJobPeriod${ i }`],
    })
  }

  return {
    basic_details: basicDetails,
    citizenship_details: citizenshipDetails,
    address_details: addressDetails,
    family_details: familyDetails,
    children_details: childrenDetails,
    education_details: educationDetails,
    previous_job_details: previousJobDetails,
  }
}


export default {
  submitForm: submitForm
}