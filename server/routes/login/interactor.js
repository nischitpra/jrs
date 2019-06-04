const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id } = require('../../constants')
const db = require('../../database')
const utils = require('../../utils')

const verifyJSON = require('./schema/verify.json')

const verifyLogin = async ( req, res )=>{
  try {
    const validation = validate( req.body, verifyJSON )
    if( validation.valid ) {
      const data = req.body
      const value = await db.find( `select * from login where employee_id=$1 and password=$2;`, [data.employee_id, data.password] )
      if( value.length ) {
        const sessionData = {
          employee_id: data.employee_id,
          token: utils.generateToken( data.employee_id )
        }
        //TODO: need to put department and position_level as well for further access control
        await db.insert( id.database.tableName.login_session, id.database.keyList.login_session, [0, 1], [sessionData] )
        return res.json({ status: true })
      }
      
      return res.sendStatus( 403 )
    }
    else {
      console.log( "login.verifyLogin", validation.errors )
      return sendStatusWithMessage( res, 403, 'Invalid request body.')
    }
  }
  catch( err ) {
    console.log( "login.verifyLogin", err )
    return res.sendStatus( 500 )
  }
}

const logout = async ( token, user, res )=>{
  try {
    await db.run( `update login_session set token=$1 where employee_id=$2 and token=$3;`, [`-${token}`, user.employeeId, token] ) 

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