const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

const path = require('path')
const fs = require('fs')


const getPath = ( dirName, imageName )=>{
  return path.join( path.resolve( __dirname, '../../' ), 'uploads', dirName, imageName )
}

router.get('/profile',(req,res)=>{
  if( !req.query.image ) return res.status( 403 ).send( 'Invalid Request Query.' )

  const filestream = fs.createReadStream( getPath( 'profile', req.query.image ) )
  filestream.on( 'open',()=>{
    res.set('Content-Type', 'image/*');
    filestream.pipe(res)
  })
})

module.exports = router