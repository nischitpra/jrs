import { sendRequest } from '../../../helper/httpHelper'
import { hashPassword } from '../../../utils'

const getProfileDetails = ( cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not get Profile details',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/employee/profile', undefined, handler )
}

const changePassword = ( oldPassword, newPassword, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not change password.',
      cb: ()=>{},
    }
  }

  sendRequest( 'post', '/employee/changePassword', { oldPassword: hashPassword( oldPassword ) , newPassword: hashPassword( newPassword ) }, handler )
} 

export default {
  changePassword: changePassword,
  getProfileDetails: getProfileDetails,
}