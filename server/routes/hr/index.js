const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.get('/employee', function(req, res, next) {
  interactor.getEmployee( res )
});

module.exports = router;
