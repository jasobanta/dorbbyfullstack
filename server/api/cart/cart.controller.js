/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * PATCH   /api/things/:id          ->  patch
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Cart from './cart.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Things
export function index(req, res) {
  return Cart.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Things
export function findbyuidpid(req, res) {
  var searchparams = {};
  searchparams.userid = req.params.uid;
  searchparams.product = req.params.pid;

  return Cart.find(searchparams).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  var userid = req.params.uid;

  return Cart.find({userid: userid})
  .populate({path:'product', model: 'Product', populate:[
   {path: 'size', model: 'MasterAttr'},
   {path: 'color', model: 'MasterAttr'},
   {path: 'brands', model: 'Brand'},
   {path: 'material', model: 'MasterAttr'},
   {path: 'vendors', model: 'Vendor'},
   ]})
   .populate({path: 'images', model: 'Upload'})
  .exec()
  .then(cart => {
    res.json(cart);
  })
  .catch(handleError(res));
  /*return Cart.find({userid: req.params.uid}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

// Creates a new Thing in the DB
export function create(req, res) {
  return Cart.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Thing in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Cart.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
