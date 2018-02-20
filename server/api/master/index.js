'use strict';

var express = require('express');
var controller = require('./master.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/getbyname/:name', controller.getbyname);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
