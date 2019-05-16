import { sendRequest } from '../../../../helper/httpHelper'

const getRegistrationList = ( cb )=>{
  const helper = {
    cb: cb,
    err: {
      message: 'Could not get Registration List',
      cb: ()=>{}
    }
  }

  sendRequest( 'get', '/reqregemp', undefined, helper )
}

const approve = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/reqregemp/approve', { tempId: id }, helper )
}

const reject = ( id, cb )=>{
  const helper = {
    cb: cb,
  }

  sendRequest( 'post', '/reqregemp/reject', { tempId: id }, helper )
}

export default {
  getRegistrationList: getRegistrationList,
  approve: approve,
  reject: reject,
}