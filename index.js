var AssetsCompiler = require('./lib/assets-compiler');

exports.init = function(compound) {
    compound.assetsCompiler = new AssetsCompiler(this);
    compound.injectMiddlewareAfter('expressInit', compound.assetsCompiler.init());
};
