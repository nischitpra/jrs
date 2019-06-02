const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

const path = require('path');
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: ( req, file, cb )=>{
    cb( null, path.join( path.resolve( __dirname, '../../' ), '/uploads' ) )
  },
  filename: ( req, file, cb )=>{
    req.fileName = file.fieldname + '-' + new Date().getTime()
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