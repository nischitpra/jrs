const { sendStatusWithMessage } = require('../../utils')
const { id, values } = require('../../constants')
const db = require('../../database')

const uploadFile = async ( req, res )=>{
  try {
    if( !req.files ) {
      console.log( 'no file recieved' )
      return sendStatusWithMessage( res, 403, 'No file recieved.' )
    }
    return res.json({ image: req.fileName })
  }
  catch( err ) {
    console.log( 'uploadFile.uploadFile', err )
    return res.sendStatus( 500 )
  }
}

module.exports = {
  uploadFile,
}