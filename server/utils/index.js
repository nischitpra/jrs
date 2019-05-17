const crypto = require('crypto')

const getCurrentDate = ()=>{
  const date = new Date()
  return date.getDate() + "." + ( date.getMonth() + 1 ) + "." + date.getFullYear() 
}

const generateLoginToken = ( employeeId )=>{
  const salt1 = process.env.login_token_salt 
  const salt2 = getCurrentDate() + salt1
  const pass1 = crypto.createHmac( 'sha256', salt1 ).update( employeeId ).digest( 'hex' )
  const pass2 = crypto.createHmac( 'sha256', salt2 ).update( pass1 ).digest( 'hex' )

  return pass2 
}

const verifyLoginToken = ( token, employeeId )=>{
  const genToken = generateLoginToken( employeeId )
  return token == genToken
}

module.exports = {
  getCurrentDate: getCurrentDate,
  generateLoginToken: generateLoginToken,
  verifyLoginToken: verifyLoginToken,
}