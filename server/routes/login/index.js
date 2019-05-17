const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.post('/', function(req, res, next) {
  interactor.verifyLogin( req.body.employeeId, req.body.password, res )
});

module.exports = router;
