const db = require('../../database')
const verifyLogin = async ( employeeId, password, res )=>{
  try {
    const value = await db.find( `select * from login where employee_id=${ employeeId } and password='${ password }';` )
    if( value.length ) return res.json({ status: true })
  
    return res.sendStatus( 403 )
  }
  catch( err ) {
    console.log( "login.verifyLogin", err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  verifyLogin: verifyLogin
}