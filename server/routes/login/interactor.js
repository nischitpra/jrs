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

const logout = async ( user, res )=>{
  try {
    await db.run( `update login_session set token='-1'||token where employee_id=${ user.employeeId };` ) 

    return res.json({ status: 'ok' })
  }
  catch( err ) {
    console.log( "login.logout", err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  verifyLogin: verifyLogin,
  logout: logout,
}