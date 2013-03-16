var fs = require('fs')
  , path = require('path');

describe('assets-compiler', function() {
  describe('merging', function() {
    it('should merge stylesheets', function (done) {
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
  });
});

function ensureDirClean(dir, callback) {
    if(!callback) callback = function(){};
    fs.exists(dir, function(exists) {
        if (exists) {
            fs.readdir(dir, function(err, files) {
                files.map(function(file) {
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
