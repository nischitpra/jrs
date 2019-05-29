const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.get('/', ( req, res, next )=>{
  interactor.getOption( req, res )
})

router.post('/create', ( req, res, next )=>{
  interactor.createOption( req, res )
})

router.post('/edit', ( req, res, next )=>{
  interactor.editOption( req, res )
})


module.exports = router