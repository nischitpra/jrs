import { sendRequest } from '../../../helper/httpHelper'

const getApplicationDetails = ( form_id, cb )=>{
  const helper = {
    cb: cb,
    error: {
      message: 'Could not get Application'
    }
  }

  sendRequest( 'get', `/employeeForm/application?form_id=${ form_id }`, undefined, helper )
}


export default {
  getApplicationDetails
}