const { id } = require('../../constants')
const db = require('../../database')
const utils = require('../../utils')



const verifyLogin = async ( employeeId, password, res )=>{
  try {
    const value = await db.find( `select * from login where employee_id=${ employeeId } and password='${ password }';` )
    if( value.length ) {
      const sessionData = {
        employee_id: employeeId,
        token: utils.generateToken( employeeId )
      }
      await db.insert( id.database.tableName.login_session, id.database.keyList.login_session, [0, 1], [sessionData] )
      return res.json({ status: true })
    }
    
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