'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newOrder;

describe('Thing API:', function() {
  describe('GET /api/orders', function() {
    var things;

    beforeEach(function(done) {
      request(app)
        .get('/api/orders')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          orders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      orders.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/orders', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/orders')
        .send({
          name: 'New Orders',
          info: 'This is the brand new order!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newOrder = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      newOrder.name.should.equal('New Order');
      newOrder.info.should.equal('This is the brand new order!!!');
    });
  });

  describe('GET /api/orders/:id', function() {
    var order;

    beforeEach(function(done) {
      request(app)
        .get(`/api/orders/${newOrder._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          order = res.body;
          done();
        });
    });

    afterEach(function() {
      order = {};
    });

    it('should respond with the requested thing', function() {
      order.name.should.equal('New Order');
      order.info.should.equal('This is the brand new order!!!');
    });
  });

  describe('PUT /api/orders/:id', function() {
    var updatedOrder;

    beforeEach(function(done) {
      request(app)
        .put(`/api/orders/${newOrder._id}`)
        .send({
          name: 'Updated Order',
          info: 'This is the updated order!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedOrder = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrder = {};
    });

    it('should respond with the updated order', function() {
      updatedOrder.name.should.equal('Updated Order');
      updatedOrder.info.should.equal('This is the updated order!!!');
    });

    it('should respond with the updated order on a subsequent GET', function(done) {
      request(app)
        .get(`/api/orders/${newOrder._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let order = res.body;

          order.name.should.equal('Updated Order');
          order.info.should.equal('This is the updated order!!!');

          done();
        });
    });
  });

  describe('PATCH /api/orders/:id', function() {
    var patchedOrder;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/orders/${newOrder._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Order' },
          { op: 'replace', path: '/info', value: 'This is the patched order!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedOrder = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedOrder = {};
    });

    it('should respond with the patched order', function() {
      patchedOrder.name.should.equal('Patched Order');
      patchedOrder.info.should.equal('This is the patched order!!!');
    });
  });

  describe('DELETE /api/orders/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/orders/${newOrder._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when order does not exist', function(done) {
      request(app)
        .delete(`/api/orders/${newOrder._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
