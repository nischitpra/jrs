const crypto = require('crypto')
const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id, values } = require('../../constants')
const db = require('../../database')

const saveApplicationJSON = require('./schema/saveApplication.json')
const approveJSON = require('./schema/approve.json')
const rejectJSON = require('./schema/reject.json')


const saveApplication = async ( req, res )=>{
  try {
    const validation = validate( req.body, saveApplicationJSON )
    if( validation.valid ) {
      const application = req.body
      
      
      // TODO: verify data is consistant with the database

      const department = ( await db.find( `select * from department_options where name=$1;`, [application.basic_details.department]) )[0]
      const position = ( await db.find( `select * from position_options where name=$1;`, [application.basic_details.position] ) )[0]
      
      if( !department ) return sendStatusWithMessage( res, 403, 'Invalid Department.') 
      if( !position ) return sendStatusWithMessage( res, 403, 'Invalid Position.') 

      application.basic_details.position_level = position.position_level
      application.basic_details.status = application.basic_details.position.toUpperCase() == 'CEO'? 1 : 0
      
      const form_id = ( await db.run( `insert into employee_basic_form_details 
        ( name, email, sex, date_of_birth, blood_group, department, position, position_level, profile_image, status, timestamp ) 
        values ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) returning form_id;`, 
        [application.basic_details.name, 
          application.basic_details.email, 
          application.basic_details.sex, 
          application.basic_details.date_of_birth, 
          application.basic_details.blood_group, 
          application.basic_details.department, 
          application.basic_details.position, 
          application.basic_details.position_level, 
          application.basic_details.profile_image, 
          application.basic_details.status, 
          new Date().getTime()] 
        ) ).rows[0].form_id 
        
      
      application.citizenship_details.form_id = form_id
      application.address_details.form_id = form_id
      application.family_details.form_id = form_id

      for( var i in application.children_details.form_id ) {
        application.children_details.form_id = form_id
      } 
      for( var i in application.education_details ) {
        application.education_details[i].form_id = form_id
      }
      for( var i in application.previous_job_details ) {
        application.previous_job_details[i].form_id = form_id
      }


      if( application.address_details.is_current_address.toLowerCase() == 'y' ) {
        application.address_details.permanent_province = ''
        application.address_details.permanent_district = ''
        application.address_details.permanent_city_type = ''
        application.address_details.permanent_ward = -1
        application.address_details.permanent_block = ''
        application.address_details.permanent_tole = '' 
      }

      await db.insert( 'employee_citizenship_form_details', id.database.keyList.employee_citizenship_form_details, [1,2,3,4], [application.citizenship_details] )
      await db.insert( 'employee_address_form_details', id.database.keyList.employee_address_form_details, [1,2,3,4,5,6,7,8,9,10,11,12,13,14], [application.address_details] )
      await db.insert( 'employee_family_form_details', id.database.keyList.employee_family_form_details, [1,2,3,4,5,6], [application.family_details] )
      if( application.children_details.length > 0 ) {
        await db.insert( 'employee_children_form_details', id.database.keyList.employee_children_form_details, [1,2,3], application.children_details )
      }
      if( application.education_details.length > 0 ) {
        await db.insert( 'employee_education_form_details', id.database.keyList.employee_education_form_details, [1,2,3,4,5,6], application.education_details )
      }
      if( application.previous_job_details.length > 0 ) {
        await db.insert( 'employee_previous_job_form_details', id.database.keyList.employee_previous_job_form_details, [1,2,3,4,5], application.previous_job_details )
      }

      return res.json({ status: 'OK' })
    }
    else {
      console.log( 'requestRegistrationEmployee.saveApplication', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.saveApplication', err )
    return res.sendStatus( 500 )
  }
}

const update = async ( req, res )=>{
  try {
    const validation = validate( req.body, saveApplicationJSON )
    if( validation.valid ) {
      const application = req.body

      console.log( application )
      
      // TODO: verify data is consistant with the database

      const department = ( await db.find( `select * from department_options where name=$1;`, [application.basic_details.department]) )[0]
      const position = ( await db.find( `select * from position_options where name=$1;`, [application.basic_details.position] ) )[0]
      
      if( !department ) return sendStatusWithMessage( res, 403, 'Invalid Department.') 
      if( !position ) return sendStatusWithMessage( res, 403, 'Invalid Position.') 

      application.basic_details.position_level = position.position_level
      application.basic_details.status = application.basic_details.position.toUpperCase() == 'CEO'? 1 : 0
      
      const { rowCount } = ( await db.run( `update employee_basic_form_details set
        name=$1,
        email=$2,
        sex=$3,
        date_of_birth=$4,
        blood_group=$5,
        department=$6,
        position=$7,
        position_level=$8,
        profile_image=$9,
        status=$10,
        timestamp=$11
        
        where form_id=$12;`, 
        [
          application.basic_details.name, 
          application.basic_details.email, 
          application.basic_details.sex, 
          application.basic_details.date_of_birth, 
          application.basic_details.blood_group, 
          application.basic_details.department, 
          application.basic_details.position, 
          application.basic_details.position_level, 
          application.basic_details.profile_image, 
          application.basic_details.status, 
          new Date().getTime(),
          application.form_id
        ] 
      ) ) 
      
     
      if( application.address_details.is_current_address.toLowerCase() == 'y' ) {
        application.address_details.permanent_province = ''
        application.address_details.permanent_district = ''
        application.address_details.permanent_city_type = ''
        application.address_details.permanent_ward = -1
        application.address_details.permanent_block = ''
        application.address_details.permanent_tole = '' 
      }

      application.citizenship_details.form_id = application.form_id
      application.address_details.form_id = application.form_id
      application.family_details.form_id = application.form_id
      for( var i in application.children_details.form_id ) {
        application.children_details.form_id = application.form_id
      } 
      for( var i in application.education_details ) {
        application.education_details[i].form_id = application.form_id
      }
      for( var i in application.previous_job_details ) {
        application.previous_job_details[i].form_id = application.form_id
      }

      await db.run( `delete from employee_address_form_details where form_id=$1;`, [application.form_id] )
      await db.run( `delete from employee_family_form_details where form_id=$1;`, [application.form_id] )
      await db.run( `delete from  employee_citizenship_form_details where form_id=$1;`, [application.form_id] )

      await db.insert( 'employee_citizenship_form_details', id.database.keyList.employee_citizenship_form_details, [1,2,3,4], [application.citizenship_details] )
      await db.insert( 'employee_address_form_details', id.database.keyList.employee_address_form_details, [1,2,3,4,5,6,7,8,9,10,11,12,13,14], [application.address_details] )
      await db.insert( 'employee_family_form_details', id.database.keyList.employee_family_form_details, [1,2,3,4,5,6], [application.family_details] )
      
      if( application.children_details.length > 0 ) {
        await db.run( `delete from employee_children_form_details where form_id=$1;`, [application.form_id] )
        await db.insert( 'employee_children_form_details', id.database.keyList.employee_children_form_details, [1,2,3], application.children_details )
      }
      if( application.education_details.length > 0 ) {
        await db.run( `delete from employee_education_form_details where form_id=$1;`, [application.form_id] )
        await db.insert( 'employee_education_form_details', id.database.keyList.employee_education_form_details, [1,2,3,4,5,6], application.education_details )
      }
      if( application.previous_job_details.length > 0 ) {
        await db.run( `delete from employee_previous_job_form_details where form_id=$1;`, [application.form_id] )
        await db.insert( 'employee_previous_job_form_details', id.database.keyList.employee_previous_job_form_details, [1,2,3,4,5], application.previous_job_details )
      }

      return res.json({ status: 'OK' })
    }
    else {
      console.log( 'requestRegistrationEmployee.update', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.update', err )
    return res.sendStatus( 500 )
  }
}
// TODO: adapt all functions to new tables

const getApplicationList = async ( res )=>{
  try {
    const result = await db.find( `select * from employee_basic_form_details where status=0 order by timestamp desc;` )
    return res.json( result )
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.getRegistrationList', err )
    return res.sendStatus( 500 )
  }
}

const getApplication = async ( req, res )=>{
  try {
    const form_id = req.query.form_id
    if( !form_id ) return sendStatusWithMessage( res, 403, 'Invalid request query.')

    const basicDetails = ( await db.find( `select * from employee_basic_form_details where form_id=$1;`, [form_id] ) )[0]
    const citizenshipDetails = ( await db.find( `select * from employee_citizenship_form_details where form_id=$1;`, [form_id] ) )[0]
    const addressDetails = ( await db.find( `select * from employee_address_form_details where form_id=$1;`, [form_id] ) )[0]
    const familyDetails = ( await db.find( `select * from employee_family_form_details where form_id=$1;`, [form_id] ) )[0]
    const childrenDetails = ( await db.find( `select * from employee_children_form_details where form_id=$1;`, [form_id] ) )
    const educationDetails = ( await db.find( `select * from employee_education_form_details where form_id=$1;`, [form_id] ) )
    const previousJobDetails = ( await db.find( `select * from employee_previous_job_form_details where form_id=$1;`, [form_id] ) )

    return res.json({
      basicDetails,
      citizenshipDetails,
      addressDetails,
      familyDetails,
      childrenDetails,
      educationDetails,
      previousJobDetails,
    })
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.getApplication', err )
    return res.sendStatus( 500 )
  }
}


const generatePassword = ()=>{
  const password = 'asdf' // TODO: need to create random password and mail it to the user
  const salt1 = process.env.password_salt 
  const pass1 = crypto.createHmac( 'sha256', salt1 ).update( password ).digest( 'hex' )

  return pass1
}

const approve = async ( req, res )=>{
  try {
    const validation = validate( req.body, approveJSON )
    if( validation.valid ) {
      const formId = req.body.form_id
      const form = ( await db.find( `select * from employee_basic_form_details where form_id=$1 and status=0;`, [formId]) )[0]

      const getImmediateBossQuery = `select * from employee_id_realtions as a inner join (select * from employee_basic_form_details 
        where position_level<$1) as b on a.form_id=b.form_id 
        where department=$2 or department='*' order by position_level desc; `
  
      const immediateBoss = ( await db.find( getImmediateBossQuery, [form.position_level, form.department] ) )[0].employee_id
      
      const basicData = {
        form_id: form.form_id,
        immediate_boss_employee_id: immediateBoss,
      }
  
      // TODO: fix this with a single query. insert into employee_id_realtions and get employee_id
      await db.insert( id.database.tableName.employee_id_realtions, id.database.keyList.employee_id_realtions, [1,2], [basicData] )
      const employeeId = ( await db.find( `select employee_id from employee_id_realtions where form_id=$1`, [formId]) )[0].employee_id
  
      // create login account
      const loginData = {
        employee_id: employeeId,
        password: generatePassword(),
      }
      await db.insert( id.database.tableName.login, id.database.keyList.login, [0,1], [loginData] )
      
      //update form status to verified
      await db.run( `update employee_basic_form_details set status=1 where form_id=$1;`, [formId] ) 
      
      //update immedate_boss table with employeeId if of higher level
      await db.run( `update employee_id_realtions set immediate_boss_employee_id = $1 
        where form_id in ( select form_id from employee_basic_form_details where department=$2 and position_level>$3) 
        and immediate_boss_employee_id=$4 and employee_id!=$1;`, 
        [employeeId,form.department,form.position_level,immediateBoss] )
  
      const leaveOptions = await db.find( `select * from leave_options;` )
     
      //create available_leave data
      const availableLeaveData = []
      for( let i in leaveOptions ) {
        availableLeaveData.push({
          employee_id: employeeId,
          accumulated: 0,
          this_year: leaveOptions[i].max,
          used: 0,
          type: leaveOptions[i].name,
        })
      }
      await db.insert( id.database.tableName.available_leave, id.database.keyList.available_leave, [1,2,3,4,5], availableLeaveData )
  
      return res.json({ status: 'OK' })
    }
    else {
      console.log( 'requestRegistrationEmployee.approve', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.approve', err )
    return res.sendStatus( 500 )
  }
  
}
const reject = async ( req, res )=>{
  try {
    const validation = validate( req.body, rejectJSON )
    if( validation.valid ) {
      const data = req.body
      await db.insert( 'position_options', id.database.keyList.position_options, [1,2,3,4], [data] )
      const formId = req.body.form_id
      await db.run( `delete from employee_basic_form_details where form_id=$1 and status=0;`, [formId] )
      return res.json({ status: 'OK'})
    }
    else {
      console.log( 'requestRegistrationEmployee.reject', validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.reject', err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  saveApplication,
  getApplicationList,
  getApplication,
  update,
  approve,
  reject,
}