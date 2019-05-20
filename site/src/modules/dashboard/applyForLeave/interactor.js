import { sendRequest } from '../../../helper/httpHelper'

const getMyLeaveApplications = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get my leave application list',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/employee/getMyLeaveApplication', undefined, helper )
}

const submitLeaveApplication = ( data, cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get submit leave application',
      cb: ()=>{}
    }
  }

  sendRequest( 'post', '/employee/applyForLeave', data, helper )
}


export default {
  getMyLeaveApplications,
  submitLeaveApplication,
}