import { sendRequest } from '../../helper/httpHelper'

const submitForm = ( data, cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not submit Form',
      cb: ()=>{},
    }
  }

  sendRequest( 'post', '/reqregemp', { employeeDetails: data }, helper )
}


export default {
  submitForm: submitForm
}