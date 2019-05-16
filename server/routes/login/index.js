const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.post('/', function(req, res, next) {
  console.log( req.body, req.body.employeeId, req.body.employeeId == 1 )
  interactor.verifyLogin( req.body.employeeId, req.body.password, res )
});

module.exports = router;
