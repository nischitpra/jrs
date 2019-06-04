import { base_api, get_header, post_header } from '../constants'
import utils from '../utils'

export const sendRequest = ( method, api, body, handler )=>{
  const config = {}
  config.method = method
  config.headers = method.toLowerCase() == 'post' ? Object.assign( {}, post_header ) : Object.assign( {}, get_header )
  if( window.user ) config.headers.token = utils.generateToken( window.user.employeeId )

  if( body instanceof FormData ) {
    delete config.headers['Content-Type']
    config.body = body
  }
  else {
    config.body = method.toLowerCase() == 'post' ? JSON.stringify( body ) : undefined
  }

  fetch( base_api + api, config )
  .then( response=>{
    if( response.ok ) {
      return response.json()
    }
    else {
      switch ( response.status ) {
        case 400:
          alert( handler.err.message ? handler.err.message : 'Action denied')
          break
        case 500:
          alert( handler.err.message ? handler.err.message : 'Something went wrong on ourside. We\'re looking into it!' )
          break
        default:
          alert( response.statusText )
          break
      }
      if( handler.err && handler.err.cb ) {
        handler.err.cb()
      }
      throw response.statusText
    }
  })
  .then( json=>{
    return handler.cb( json )
  })
  .catch( err=>{
    console.log('could not fetch ', err)
    if( handler.err && handler.err.cb ) {
      handler.err.cb()
    }
  })
}

export default {
  sendRequest: sendRequest
}