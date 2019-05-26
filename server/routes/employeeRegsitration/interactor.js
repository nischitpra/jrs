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
      const employeeDetails = req.body
      employeeDetails.position_level = id.requestRegistrationEmployee.positionLevel[employeeDetails.position] 
      employeeDetails.status = employeeDetails.position == 'CEO'? 1 : 0

      await db.insert( id.database.tableName.employee_form_details, id.database.keyList.employee_form_details, [1,2,3,4,5,6,7,8], [employeeDetails] )
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
  
const getApplicationList = async ( res )=>{
  try {
    const result = await db.find( `select * from employee_form_details where status=0 order by timestamp desc;` )
    return res.json( result )
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.getRegistrationList', err )
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
      const form = ( await db.find( `select * from employee_form_details where form_id=${formId} and status=0;`) )[0]

      const getImmediateBossQuery = `select * from employee_basic_details as a inner join (select * from employee_form_details 
        where position_level<${ form.position_level }) as b on a.form_id=b.form_id 
        where department='${ form.department }' or department='all' order by position_level desc; `
  
      const immediateBoss = ( await db.find( getImmediateBossQuery ) )[0].employee_id
      
      const basicData = {
        form_id: form.form_id,
        immediate_boss_employee_id: immediateBoss,
      }
  
      // insert into employee_basic_details and get employee_id
      await db.insert( id.database.tableName.employee_basic_details, id.database.keyList.employee_basic_details, [1,2], [basicData] )
      // TODO: create insert with return to get employee_id instead of making db query again
      const employeeId = ( await db.find( `select employee_id from employee_basic_details where form_id=${formId}`) )[0].employee_id
  
      // create login account
      const loginData = {
        employee_id: employeeId,
        password: generatePassword(),
      }
      await db.insert( id.database.tableName.login, id.database.keyList.login, [0,1], [loginData] )
      
      //update form status to verified
      await db.run( `update ${id.database.tableName.employee_form_details} set status=1 where form_id=${formId};` ) 
      
      //update immedate_boss table with employeeId if of higher level
      await db.run( `update employee_basic_details set immediate_boss_employee_id = ${employeeId} 
        where form_id in ( select form_id from employee_form_details where department='${form.department}' and position_level>${form.position_level}) 
        and immediate_boss_employee_id=${immediateBoss} and employee_id!=${employeeId};` )
  
      const leaveOptions = await db.find( `select * from leave_options;` )
     
      //create available_leave data
      const availableLeaveData = []
      for( let i in leaveOptions ) {
        const row = {
          employee_id: employeeId,
          accumulated: 0,
          this_year: leaveOptions[i].max,
          used: 0,
          type: leaveOptions[i].name,
        }
        availableLeaveData.push( row )
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
      const formId = req.body.form_id
      await db.run( `delete from ${id.database.tableName.employee_form_details} where form_id=${formId} and status=0;` )
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
  approve,
  reject,
}