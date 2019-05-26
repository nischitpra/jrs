import { sendRequest } from '../../../helper/httpHelper'

const getLeaveApplicationList = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get Registration List',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/leave/getApplicationForApproval', undefined, helper )
}

const approve = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/leave/accept', { leave_id: id }, helper )
}

const reject = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/leave/reject', { leave_id: id }, helper )
}

export default {
  getLeaveApplicationList,
  approve,
  reject
}