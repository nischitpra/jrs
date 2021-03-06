const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.get('/', ( req, res, next )=>{
  interactor.getPositionOption( req, res )
})

router.post('/create', ( req, res, next )=>{
  interactor.createPositionOption( req, res )
})

router.post('/edit', ( req, res, next )=>{
  interactor.editPositionOption( req, res )
})


module.exports = router