const through = require('through2'),
  gutil = require('gulp-util'),
  prettier = require('prettier'),
  merge = require('merge'),
  applySourceMap = require('vinyl-sourcemaps-apply');

var PluginError = gutil.PluginError;

module.exports = function(opt) {
  function transform(file, encoding, callback) {
    if (file.isNull())
      return callback(null, file);
    if (file.isStream())
      return callback(new PluginError(
        'gulp-prettier',
        'Streaming not supported'
      ));

    let data;
    let str = file.contents.toString('utf8');

    options = merge(
      {
        // If true, will use single instead of double quotes
        singleQuote: false
      },
      opt
    );

    try {
      data = prettier.format(str, options);
    } catch (err) {
      console.log('there was a fucking error b!!');
      return callback(new PluginError('gulp-prettier', err));
    }

    if (data && data.v3SourceMap && file.sourceMap) {
      applySourceMap(file, data.v3SourceMap);
      file.contents = new Buffer(data.js);
    } else {
      file.contents = new Buffer(data);
    }

    callback(null, file);
  }

  return through.obj(transform);
};
