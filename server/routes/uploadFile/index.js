const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

const uuidv4 = require('uuid/v4');
const path = require('path');
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: ( req, file, cb )=>{
    cb( null, path.join( path.resolve( __dirname, '../../' ), 'uploads', 'profile' ) )
  },
  filename: ( req, file, cb )=>{
    req.fileName = file.fieldname + '-' + new Date().getTime() + '-' + uuidv4() // TODO: need to use random uuid instead of this
    return cb( null, req.fileName )
  },
})
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
})


router.post('/profile', upload.fields( [{ name: 'profile', maxCount: 1 }] ), ( req, res, next )=>{
  interactor.uploadFile( req, res )
})


module.exports = router