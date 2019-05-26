import { sendRequest } from '../../../helper/httpHelper'

const getLeaveOptions = ( cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not get leave options.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'get', '/leaveOption', undefined, handler )
}

const createLeaveOption = ( data, cb)=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not create leave option.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'post', '/leaveOption/create', data, handler )
}

const deleteLeaveOption = ( data, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not delete leave option.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'post', '/leaveOption/delete', data, handler )
}

export default {
  getLeaveOptions,
  createLeaveOption,
  deleteLeaveOption,
}