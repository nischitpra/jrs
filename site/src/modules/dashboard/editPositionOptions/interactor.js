import { sendRequest } from '../../../helper/httpHelper'

const getPositionOptions = ( cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not get position options.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'get', '/positionOption', undefined, handler )
}

const createPositionOption = ( data, cb)=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not create position option.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'post', '/positionOption/create', data, handler )
}

const editPositionOption = ( data, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not edit position option.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'post', '/positionOption/edit', data, handler )
}

const getDepartmentOptions = ( cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not get department options.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'get', '/departmentOption', undefined, handler )
}

export default {
  getPositionOptions,
  createPositionOption,
  editPositionOption,
  getDepartmentOptions,
}