import { base_api, get_header, post_header } from '../constants'


export const sendRequest = ( method, api, body, handler )=>{
  const config = {}
  config.method = method
  config.headers = method.toLowerCase() == 'post' ? post_header : get_header
  config.body = method.toLowerCase() == 'post' ? JSON.stringify( body ) : undefined

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
      if( handler.err ) {
        if( handler.err.cb ) {
          return handler.err.cb()
        }
      }
      throw response.statusText
    }
  })
  .then( json=>{
    return handler.cb( json )
  })
  .catch( err=>{
    console.log('could not fetch ', err)
  })
}

export default {
  sendRequest: sendRequest
}