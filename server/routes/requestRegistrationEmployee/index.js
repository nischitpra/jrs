const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.post('/', function(req, res, next) {
  interactor.saveRequest( req.body.employeeDetails, res )
});

router.get('/', (req, res, next)=>{
  interactor.getRegistrationList( res )
})

router.post('/approve', (req,res,next)=>{
  interactor.approve( req.body.formId, res ) 
})

router.post('/reject', (req,res,next)=>{
  interactor.reject( req.body.formId, res )
})

module.exports = router;
