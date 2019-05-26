import { sendRequest } from '../../helper/httpHelper'
import { hashPassword } from '../../utils'

const login = ( employee_id, pass, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Invalid username or password.',
      cb: ()=>{}
    }
  }
  
  const password = hashPassword( pass )
  sendRequest( 'post', '/login', { employee_id, password }, handler )
}


export default {
  login: login
}