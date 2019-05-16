const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.get('/employee', function(req, res, next) {
  interactor.getEmployee( req.query.all, res )
});

module.exports = router;
