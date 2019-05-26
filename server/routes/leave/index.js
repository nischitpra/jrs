const express = require('express');
const router = express.Router();
const interactor = require('./interactor')
const jobs = require('./jobs')

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
  interactor.acceptApplication( req, res )
})

router.post('/reject', ( req, res )=>{
  interactor.rejectApplication( req, res )
})

module.exports = router




// perform jobs here
jobs.renewThisYearLeave.start()