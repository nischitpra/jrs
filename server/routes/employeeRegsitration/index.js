const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.post('/', (req, res, next)=>{
  interactor.saveApplication( req, res )
});

router.get('/', (req, res, next)=>{
  interactor.getApplicationList( res )
})

router.get('/application', (req, res, next)=>{
  interactor.getApplication( req, res )
})


router.post('/approve', (req,res,next)=>{
  interactor.approve( req, res ) 
})

router.post('/reject', (req,res,next)=>{
  interactor.reject( req, res )
})

module.exports = router;
