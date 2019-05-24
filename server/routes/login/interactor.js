const validate = require('jsonschema').validate

const { sendStatusWithMessage } = require('../../utils')
const { id } = require('../../constants')
const db = require('../../database')
const utils = require('../../utils')

const verifyJSON = require('./schema/verify.json')

const verifyLogin = async ( req, res )=>{
  try {
    if( validate( req.body, verifyJSON ) ) {
      const data = req.body
      const value = await db.find( `select * from login where employee_id=${ data.employee_id } and password='${ data.password }';` )
      if( value.length ) {
        const sessionData = {
          employee_id: data.employee_id,
          token: utils.generateToken( data.employee_id )
        }
        await db.insert( id.database.tableName.login_session, id.database.keyList.login_session, [0, 1], [sessionData] )
        return res.json({ status: true })
      }
      
      return res.sendStatus( 403 )
    }
    else {
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
    await db.run( `update login_session set token='-${ token }' where employee_id=${ user.employeeId } and token='${ token }';` ) 

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