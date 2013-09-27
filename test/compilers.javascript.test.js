var fs = require('fs')
  , path = require('path')
  , request = require('supertest')
  , express = require('express')
  , should  = require('should')
  , utils   = require('./utils');

describe('assets-compiler', function() {

  describe('compilers', function() {

    /*
     * javascript Compiler (Pipeline)
     */

    it('should pipeline javascripts', function (done) {
      utils.invalidateRequireCache(); // To get a fresh compound app

      var app = getApp();
      var compound = app.compound;

      // App settings
      app.set('jsEngine', 'javascript');
      app.set('jsDirectory', '/javascripts');
      app.use(express.static(app.root + '/public'));

      // Make sure previously precompiled assets are deleted
      var jsDir = app.root + '/public/javascripts';
      utils.ensureDirClean(jsDir);

      // Fake a javascript request
      request(app)
        .get('/javascripts/application.js')
        .end(function (err, res) {
          should.not.exist(err);
          res.headers['content-type'].should.match(/^application\/javascript/);
          res.headers['content-length'].should.equal('27');
          res.text.should.equal(fs.readFileSync(app.root + '/app/assets/javascripts/application.js').toString());
          
          utils.ensureDirClean(jsDir);
          done();
        });

    });
  });
});