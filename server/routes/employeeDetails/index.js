const express = require('express');
const router = express.Router();
const interactor = require('./interactor')

router.get('/', function(req, res, next) {
  interactor.getBasicDetails( req.user, res )
});

module.exports = router;
