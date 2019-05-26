const crypto = require('crypto')

const getCurrentDate = ()=>{
  const date = new Date()
  return date.getDate() + "." + ( date.getMonth() + 1 ) + "." + date.getFullYear() 
}

const generateToken = ( employeeId )=>{
  const salt1 = process.env.login_token_salt 
  const salt2 = getCurrentDate() + salt1
  const pass1 = crypto.createHmac( 'sha256', salt1 ).update( employeeId + '' ).digest( 'hex' )
  const pass2 = crypto.createHmac( 'sha256', salt2 ).update( pass1 ).digest( 'hex' )

  return pass2 
}

const verifyToken = ( token, employeeId )=>{
  const genToken = generateToken( employeeId )
  return token == genToken
}

const sendStatusWithMessage = ( res, status, message )=>{
  console.log( status, message )
  return res.status( status ).send( message )
}

module.exports = {
  getCurrentDate,
  generateToken,
  verifyToken,
  sendStatusWithMessage,
}