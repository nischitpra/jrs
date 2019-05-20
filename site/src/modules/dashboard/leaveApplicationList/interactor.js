import { sendRequest } from '../../../helper/httpHelper'

const getLeaveApplicationList = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get Registration List',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/employee/getApplicationForLeave', undefined, helper )
}

const approve = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/employee/acceptLeave', { leaveId: id }, helper )
}

const reject = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/employee/rejectLeave', { leaveId: id }, helper )
}

export default {
  getLeaveApplicationList,
  approve,
  reject
}