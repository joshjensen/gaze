'use strict';

var gaze = require('../index.js');
var path = require('path');
var fs = require('fs');

// Clean up helper to call in setUp and tearDown
function cleanUp() {
  [
    'sub/rename.js',
    'sub/renamed.js'
  ].forEach(function(d) {
    var p = path.resolve(__dirname, 'fixtures', d);
    if (fs.existsSync(p)) { fs.unlinkSync(p); }
  });
}

exports.watch = {
  setUp: function(done) {
    process.chdir(path.resolve(__dirname, 'fixtures'));
    cleanUp();
    done();
  },
  tearDown: function(done) {
    cleanUp();
    done();
  },
  rename: function(test) {
    test.expect(2);
    var oldPath = path.join(__dirname, 'fixtures', 'sub', 'rename.js');
    var newPath = path.join(__dirname, 'fixtures', 'sub', 'renamed.js');
    fs.writeFileSync(oldPath, 'var rename = true;');
    gaze('**/*', function(err, watcher) {
      watcher.on('renamed', function(newFile, oldFile) {
        test.equal(newFile, newPath);
        test.equal(oldFile, oldPath);
        watcher.on('end', test.done);
        watcher.close();
      });
      fs.renameSync(oldPath, newPath);
    });
  }
};
