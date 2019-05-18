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

  sendRequest( 'post', '/employeeForm/approve', { formId: id }, helper )
}

const reject = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/employeeForm/reject', { formId: id }, helper )
}

export default {
  getRegistrationList: getRegistrationList,
  approve: approve,
  reject: reject,
}