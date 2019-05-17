const crypto = require('crypto')

const { id } = require('../../constants')
const db = require('../../database')

const saveRequest = async ( employeeDetails, res )=>{
  employeeDetails.position_level = id.requestRegistrationEmployee.positionLevel[employeeDetails.position] 
  employeeDetails.status = employeeDetails.position == 'CEO'? 1 : 0
  try {
    await db.insert( id.database.tableName.employee_form_details, id.database.keyList.employee_form_details, [1,2,3,4,5,6,7,8], [employeeDetails] )
    return res.json({ status: 'OK' })
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.saveRequest', err )
    return res.sendStatus( 500 )
  }
}
  
const getRegistrationList = async ( res )=>{
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

const approve = async ( formId, res )=>{
  try {
    const form = ( await db.find( `select * from employee_form_details where form_id=${formId} and status=0;`) )[0]
    const getImmediateBossQuery = `select employee_id from employee_basic_details where employee_basic_details.form_id in 
      ( select form_id from employee_form_details where department='${form.department}' 
        and position_level<${form.position_level} and status=1 order by position_level asc limit 1); `

    const immediateBoss = ( await db.find( getImmediateBossQuery ) )[0].employee_id
    
    const basicData = {
      form_id: form.form_id,
      immediate_boss: immediateBoss,
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
    //TODO:update immedate_boss table with employeeId 

    // update children immediate boss
    // if( applicationPositionIndex + 1 < positionLevel.length ) {
    //   for( let i = 0; i < global.employeeList[ positionLevel[ applicationPositionIndex + 1 ] ].length; i++ ) {
    //     global.employeeList[ positionLevel[ applicationPositionIndex + 1 ] ][i].immediateBoss = application.name
    //   }
    // }
    
    return res.json({ status: 'OK' })
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.approve', err )
    return res.sendStatus( 500 )
  }
  
}
const reject = async ( formId, res )=>{
  try {
    await db.run( `delete from ${id.database.tableName.employee_form_details} where form_id=${formId} and status=0;` )
    return res.json({ status: 'OK'})
  }
  catch( err ) {
    console.log( 'requestRegistrationEmployee.reject', err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  saveRequest: saveRequest,
  getRegistrationList: getRegistrationList,
  approve: approve,
  reject: reject
}