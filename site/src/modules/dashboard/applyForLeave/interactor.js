import { sendRequest } from '../../../helper/httpHelper'

const getLeaveTypes = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get Leave Types',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/leaveOption', undefined, helper ) 
}

const getMyLeaveApplications = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get my leave application list',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/leave', undefined, helper )
}

const submitLeaveApplication = ( data, cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not submit leave application',
      cb: ()=>{}
    }
  }

  sendRequest( 'post', '/leave/applyForLeave', data, helper )
}

const cancelLeaveApplication = ( data, cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not cancel leave application',
      cb: ()=>{}
    }
  }

  sendRequest( 'post', '/leave/deleteApplication', data, helper )
}

export default {
  getLeaveTypes,
  getMyLeaveApplications,
  submitLeaveApplication,
  cancelLeaveApplication,
}