import { sendRequest } from '../../../helper/httpHelper'

const getRegistrationList = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get Registration List',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/employeeForm', undefined, helper )
}

const approve = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/employeeForm/approve', { form_id: id }, helper )
}

const reject = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/employeeForm/reject', { form_id: id }, helper )
}

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
  getRegistrationList,
  approve,
  reject,
  getApplicationDetails,
}