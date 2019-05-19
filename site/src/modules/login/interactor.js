import { sendRequest } from '../../helper/httpHelper'
import { hashPassword } from '../../utils'

const login = ( employeeId, pass, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Invalid username or password.',
      cb: ()=>{}
    }
  }
  
  const password = hashPassword( pass )
  sendRequest( 'post', '/login', { employeeId, password }, handler )
}


export default {
  login: login
}