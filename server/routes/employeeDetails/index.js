const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.get('/', function(req, res, next) {
  interactor.getBasicDetails( req.user, res )
});

router.get('/profile', ( req, res, next )=>{
  interactor.getProfileDetails( req.user, res )
})

router.post('/changePassword', ( req, res, next )=>{
  interactor.changePassword( req.user, req.body, res )
})

router.get('/getMyLeaveApplication', ( req, res, next )=>{
  interactor.getMyLeaveApplication( req.user, res )
})

router.get('/getApplicationForLeave', ( req, res, next )=>{
  interactor.getApplicationForLeave( req.user, res )
})

router.post('/applyForLeave', ( req, res, next )=>{
  interactor.applyForLeave( req.user, req.body, res )
})

router.post('/acceptLeave', ( req, res, next )=>{
  interactor.acceptLeave( req.user, req.body, res )
})

router.post('/rejectLeave', ( req, res, next )=>{
  interactor.rejectLeave( req.user, req.body, res )
})








module.exports = router;
