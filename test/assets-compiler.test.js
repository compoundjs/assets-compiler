var fs = require('fs')
  , path = require('path');

describe('assets-compiler', function() {

  describe('precompilation', function() {

    it('should precompile stylesheets', function (done) {
      invalidateRequireCache(); // To get a fresh compound app

      var app = getApp();
      var compound = app.compound;

      // App settings
      app.set('cssDirectory', '/stylesheets');
      app.enable('merge stylesheets');

      // Make sure previously precompiled assets are deleted
      var cssDir = app.root + '/public/stylesheets';
      ensureDirClean(cssDir);

      // Wait some time for precompiler to finish
      // TODO: Replace this with an event
      setTimeout(function () {
        fs.existsSync(path.resolve(cssDir, 'application.css')).should.be.true;
        fs.existsSync(path.resolve(cssDir, 'stuff.css')).should.be.true;

        // Clean up
        ensureDirClean(cssDir, function() {
          done();
        });
      }, 500);

    });

    it('should precompile coffeescripts', function (done) {
      invalidateRequireCache(); // To get a fresh compound app

      var app = getApp();
      var compound = app.compound;

      // App settings
      app.set('jsDirectory', '/javascripts');
      app.enable('merge javascripts');

      // Make sure previously precompiled assets are deleted
      var jsDir = app.root + '/public/javascripts';
      ensureDirClean(jsDir);

      // Wait some time for precompiler to finish
      // TODO: Replace this with an event
      setTimeout(function () {
        fs.existsSync(path.resolve(jsDir, 'application.js')).should.be.true;

        // Clean up
        ensureDirClean(jsDir, function() {
          done();
        });
      }, 500);

    });

  });

});

function ensureDirClean(dir, callback) {
    if(!callback) callback = function(){};
    fs.exists(dir, function(exists) {
        if (exists) {
            fs.readdir(dir, function(err, files) {
                files.filter(function (file) {
                    return file.substr(0, 1) !== '.'
                }).map(function(file) {
                    return path.join(dir, file);
                }).forEach(fs.unlinkSync);

                callback();
            });
        } else {
            fs.mkdir(dir, 0755);
            callback();
        }
    });
}


function invalidateRequireCache() {
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
  });
};