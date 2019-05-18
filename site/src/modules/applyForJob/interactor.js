import { sendRequest } from '../../helper/httpHelper'

const submitForm = ( data, cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not submit Form',
      cb: ()=>{},
    }
  }

  sendRequest( 'post', '/employeeForm', { employeeDetails: data }, helper )
}


export default {
  submitForm: submitForm
}