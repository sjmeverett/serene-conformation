
var expect = require('chai').expect;
var supertest = require('supertest-as-promised');
var express = require('express');
var Schema = require('conformation');
var Serene = require('serene');
var SereneResources = require('serene-resources');
var SereneExpress = require('serene-express');
var SereneConformation = require('../index');

describe('serene-conformation', function () {
  var app;
  var service;

  beforeEach(function () {
    app = express();
    service = new Serene();
    app.use(new SereneExpress(service));
    app.use(function (err, request, response, next) {});

    service.use(new SereneResources({
      widgets: {
        schema: Schema.object().keys({
          name: Schema.string().required()
        })
      }
    }));

    service.use(new SereneConformation());
  });

  it('should not throw if validation is correct', function () {
    var handlerRan = false;

    service.use(function (request, response) {
      handlerRan = true;
    });

    return supertest(app)
      .post('/widgets')
      .send({
        attributes: {
          name: 'test'
        }
      })
      .expect(204)
      .then(function (request, response) {
        expect(handlerRan).to.be.true;
      });
  });

  it('should strip attributes field if validation is correct', function () {
    service.use(function (request, response) {
      expect(request.body).to.eql({name: 'test'});
    });

    return supertest(app)
      .post('/widgets')
      .send({
        attributes: {
          name: 'test'
        }
      })
      .expect(204);
  });

  it('should 400 if validation is incorrect', function () {
    return supertest(app)
      .post('/widgets')
      .send({
        attributes: {}
      })
      .expect(400);
  });
});
