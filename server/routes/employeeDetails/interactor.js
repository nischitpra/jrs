const db = require('../../database')

const getBasicDetails = async ( user, res )=>{
  try {
    const details = ( await db.find( `select name, email, department, position, position_level from employee_basic_details, employee_form_details 
      where employee_basic_details.form_id=employee_form_details.form_id and employee_id=${ user.employeeId };` ) )[0]
  
    return res.json( details )
  }
  catch( err ) {
    console.log( 'employeeDetails.getBasicDetails', err )
    return res.sendStatus( 500 )
  }
}

const getProfileDetails = async ( user, res )=>{
  try {
    const personalDetails = ( await db.find( 
      `select * from employee_form_details where form_id in ( select form_id from employee_basic_details where employee_id=${ user.employeeId });` ) )[0]
    delete personalDetails.form_id
    delete personalDetails.timestamp
    delete personalDetails.status

    const immediateBossDetails = ( await db.find( 
      `select name, email, department, position, position_level from employee_form_details where form_id = 
        ( select form_id from employee_basic_details where employee_id in 
          ( select immediate_boss_employee_id from employee_basic_details where employee_id = ${ user.employeeId } ) );` ) )[0]
    
    return res.json({ personalDetails, immediateBossDetails })
  }
  catch( err ) {
    console.log( 'employeeDetails.getProfileDetails', err )
    return res.sendStatus( 500 )
  }
}

const changePassword = async ( user, data, res )=>{
  try {
    const values = await db.find( `select * from login where employee_id=${ user.employeeId } and password='${ data.oldPassword }';` )
    if( values.length ) {
      await db.run( `update login set password='${ data.newPassword }' where employee_id=${ user.employeeId };` )
      
      return res.json({ status: 'ok' })
    }

    return res.sendStatus( 403 )
  }
  catch( err ) {
    console.log( 'employeeDetails.changePassword', err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  getBasicDetails: getBasicDetails,
  getProfileDetails: getProfileDetails,
  changePassword: changePassword,
}