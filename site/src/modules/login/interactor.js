import { sendRequest } from '../../helper/httpHelper'

const login = ( employeeId, password, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Invalid username or password.',
      cb: ()=>{}
    }
  }
  sendRequest( 'post', '/login', { employeeId, password }, handler )
}


export default {
  login: login
}