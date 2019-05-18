import { sendRequest } from '../../helper/httpHelper'
const crypto = require("crypto-js");

const login = ( employeeId, pass, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Invalid username or password.',
      cb: ()=>{}
    }
  }
  const salt1 = process.env.REACT_APP_PASSWORD_SALT
  const password = crypto.HmacSHA256( pass, salt1 ).toString( crypto.enc.Hex )
  sendRequest( 'post', '/login', { employeeId, password }, handler )
}


export default {
  login: login
}