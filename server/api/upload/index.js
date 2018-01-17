'use strict';

var express = require('express');
var controller = require('./upload.controller');
var multiparty = require('connect-multiparty');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var uploadOptions = { autoFile: true}

function setuploadDir (req, res, next) {
  //console.log('---------lets fix the upload path-----------',req.params);
var todaypath = 'client/uploads/'+new Date().getUTCFullYear()+'/'+new Date().getUTCMonth()+'/'+new Date().getUTCDate()+'/'+req.params.id;
shell.mkdir('-p', todaypath);
fs.chmod(todaypath,'0755',function(err){
  if (err) return console.error(err);
  console.log('success in chmod');
});
uploadOptions.uploadDir = todaypath;

next();
}


var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/products/:id',setuploadDir, multiparty(uploadOptions), controller.productImage);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
