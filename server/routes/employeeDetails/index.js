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



module.exports = router;
