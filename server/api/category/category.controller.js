/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/categories              ->  index
 * GET     /api/categories/              ->  index
 * GET     /api/categories/gotopage     ->  gotopage
 * POST    /api/categories              ->  create
 * GET     /api/categories:id          ->  show
 * PUT     /api/categories:id          ->  upsert
 * PATCH   /api/categories:id          ->  patch
 * DELETE  /api/categories:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Category from './category.model';

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
  return Category.find()
  .exec()
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a selected of Things
/*export function gotopage(req, res) {
  var key = 'isparent';
  if(req.params.type){
    key = req.params.type;
  }
  var filter = {};
  filter[key] = true;
  return Category.find(filter).skip(req.params.from).limit(req.params.to)
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}*/


export function totalrecord(req, res) {
  return Category.find()
  .count()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  return Category.findById(req.params.id)
  .populate('ischildof')
  .populate({path: 'sizechart', model: 'Upload'})
  .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a category from the DB for side menu
export function showsidemenu(req, res) {
  return Category.findById(req.params.id)
  .populate({path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate: {path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate: {path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate:{path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate:{path: 'childs', model: 'Category', options:{ sort: {sort: 1}}}}}}})
  .sort({sort: 1})
  .populate({path: 'ischildof', model: 'Category', populate: {path:'ischildof', model: 'Category'}})
  .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Category from the DB by name
export function getbyname(req, res) {
  return Category.findOne({name: req.params.name})
  .populate({path:'childs',model: 'Category',populate:{path:'childs', model: 'Category', populate: {path:'childs', model: 'Category'}}})
  .populate({path: 'ischildof', model: 'Category'})
  .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function pcats(req, res) {
  var sorder = 1;
  if(req.params.order == 'desc') {
    sorder = -1;
  }
  return Category.find({isparent: true})
  .populate('childs')
  .sort({sort: sorder})
  .exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a single Thing from the DB
export function list(req, res) {
  var key = 'isparent';
  var filter = {};
  if(req.params.type){
    key = req.params.type;
    filter[key] = true;
  }
  if(req.params.active){
    key = req.params.active;
    filter[key] = true;
  }
  return Category.find(filter)
  .populate({path: 'ischildof', model: 'Category', options:{sort: {name: 1}}, populate: {path: 'ischildof', model: 'Category', options: { sort: {name: 1}}, populate: {path: 'ischildof', model: 'Category', populate: {path: 'ischildof', model: 'Category' }}}})
  .populate({path: 'childs', model: 'Category', populate: {path: 'childs', model: 'Category', populate: {path: 'childs', model: 'Category', populate:{path: 'childs', model: 'Category', populate:{path: 'childs', model: 'Category'}}}}})
  // .sort({name: 1})
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a single Thing from the DB
export function listchildof(req, res) {
  return Category.find({ischildof: req.params.id})
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req, res) {
  return Category.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Thing in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Category.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Category.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  return Category.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
export function categoryTree(req, res) {
  Category.find({isparent: true, active: true})
//  .populate({path: 'ischildof', model: 'Category', options:{sort: {name: 1}}, populate: {path: 'ischildof', model: 'Category', options: { sort: {name: 1}}, populate: {path: 'ischildof', model: 'Category', populate: {path: 'ischildof', model: 'Category' }}}})
  .populate({path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate: {path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate: {path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate:{path: 'childs', model: 'Category', options:{ sort: {sort: 1}}, populate:{path: 'childs', model: 'Category', options:{ sort: {sort: 1}}}}}}})
  .sort({sort: 1})
  .exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res))
}
