import { sendRequest } from '../../../helper/httpHelper'

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

const createDepartmentOption = ( data, cb)=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not create department option.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'post', '/departmentOption/create', data, handler )
}

const editDepartmentOption = ( data, cb )=>{
  const handler = {
    cb: cb,
    err: {
      message: 'Could not edit department option.',
      cb: ()=>{}
    }
  }
  
  sendRequest( 'post', '/departmentOption/edit', data, handler )
}

export default {
  getDepartmentOptions,
  createDepartmentOption,
  editDepartmentOption,
}