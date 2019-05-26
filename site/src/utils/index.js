const crypto = require('crypto-js')

const getCurrentDate = ()=>{
  const date = new Date()
  return date.getDate() + "." + ( date.getMonth() + 1 ) + "." + date.getFullYear() 
}

const generateToken = ( employeeId )=>{
  const salt1 = process.env.REACT_APP_TOKEN_SALT 
  const salt2 = getCurrentDate() + salt1
  const pass1 = crypto.HmacSHA256( employeeId + '', salt1 ).toString( crypto.enc.Hex )
  const pass2 = crypto.HmacSHA256( pass1, salt2 ).toString( crypto.enc.Hex )

  return pass2 
}

const verifyToken = ( token, employeeId )=>{
  const genToken = generateToken( employeeId )
  return token == genToken
}

const hashPassword = ( pass )=>{
  const salt1 = process.env.REACT_APP_PASSWORD_SALT
  return crypto.HmacSHA256( pass, salt1 ).toString( crypto.enc.Hex )
}

module.exports = {
  getCurrentDate: getCurrentDate,
  generateToken: generateToken,
  verifyToken: verifyToken,
  hashPassword: hashPassword,
}