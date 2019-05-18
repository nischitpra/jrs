const db = require('../../database')

const getBasicDetails = async ( user, res )=>{
  try {
    const details = ( await db.find( `select name, email, position, position_level from employee_basic_details, employee_form_details 
      where employee_basic_details.form_id=employee_form_details.form_id and employee_id=${ user.employeeId };` ) )[0]
  
    return res.json( details )
  }
  catch( err ) {
    console.log( 'employeeDetails.getBasicDetails', err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  getBasicDetails: getBasicDetails
}