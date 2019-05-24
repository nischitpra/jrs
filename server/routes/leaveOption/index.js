const express = require('express');
const router = express.Router();
const interactor = require('./interactor')


router.get('/', ( req, res, next )=>{
  interactor.getLeaveOption( req, res )
})

router.post('/create', ( req, res, next )=>{
  interactor.createLeaveOption( req, res )
})

router.post('/delete', ( req, res, next )=>{
  interactor.deleteLeaveOption( req, res )
})


module.exports = router