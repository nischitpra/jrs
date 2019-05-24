const express = require('express');
const router = express.Router();
const interactor = require('./interactor')


router.get('/', ( req, res )=>{
  interactor.getMyApplication( req, res )
})

router.post('/applyForLeave', ( req, res )=>{
  interactor.createApplication( req, res )
})

router.post('/deleteApplication', ( req, res )=>{
  interactor.deleteApplication( req, res )
})

router.get('/getApplicationForApproval', ( req, res )=>{
  interactor.getApplicationForApproval( req, res )
})

router.post('/accept', ( req, res )=>{
  interactor.acceptApplicatiion( req, res )
})

router.post('/reject', ( req, res )=>{
  interactor.rejectApplication( req, res )
})


module.exports = router