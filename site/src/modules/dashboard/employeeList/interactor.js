import {sendRequest} from '../../../helper/httpHelper'

const getEmployeeList = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get Employee List',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/hr/employee', undefined, helper )
}

export default {
  getEmployeeList: getEmployeeList
}