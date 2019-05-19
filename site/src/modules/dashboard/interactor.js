import { sendRequest } from '../../helper/httpHelper'
const crypto = require("crypto-js");

const getAccountDetails = ( cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not get account details.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'get', '/employee', {}, handler )
}

const logout = ( cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not logout.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'post', '/login/logout', {}, handler )
}


export default {
  getAccountDetails: getAccountDetails,
  logout: logout
}