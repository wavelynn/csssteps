'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var gm = _interopDefault(require('gm'));
var mkdirp = _interopDefault(require('mkdirp'));
var imagemin = _interopDefault(require('imagemin'));
var imageminJpegtran = _interopDefault(require('imagemin-jpegtran'));
var imageminPngquant = _interopDefault(require('imagemin-pngquant'));

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

// const fs = require('fs');
// const path = require('path');
// const gm = require('gm');
// const mkdirp = require('mkdirp');

// const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');

// promise fs.readdir
var preaddir = function preaddir(dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, files) {
      err ? reject(err) : resolve(files);
    });
  });
};

// an+b
var parseLinear = function parseLinear() {
  var f = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var m = /^(\d+)n(\s*\+\s*(\d+))?$/.exec(f.toString().trim()) || [];
  var a = parseInt(m[1] || 1, 10);
  var b = parseInt(m[3] | 0, 10);
  if (a <= b) {
    console.warn('> please use an+b, a<b, otherwise a=1, b=0');
    a = 1;
    b = 0;
  }
  return [a, b];
};

// get files of directory with extenstion
var getFiles = function getFiles() {
  var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var conf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var bpath = process.cwd();
  var _conf$extention = conf.extention,
      extention = _conf$extention === undefined ? '.png' : _conf$extention,
      _conf$which = conf.which;

  var _parseLinear = parseLinear(conf.which || ''),
      _parseLinear2 = slicedToArray(_parseLinear, 2),
      a = _parseLinear2[0],
      b = _parseLinear2[1];

  var fulldir = path.resolve(bpath, dir);

  return preaddir(fulldir).then(function (files) {
    extention = extention.indexOf('.') == 0 ? extention : '.' + extention;
    return {
      files: files.filter(function (f) {
        return path.extname(f) == extention;
      }).map(function (f) {
        var m = /\d+/.exec(f);

        if (!m) {
          console.warn('> cannot found file sequence number in file name...');
        }
        return {
          fullname: path.resolve(bpath, dir, f),
          number: m ? parseInt(m[0], 10) : 0
        };
      }).filter(function (f, i) {
        // 每 n (which) 张选择一张，比如只用奇数 或者 偶数
        return i % a == b;
      }),
      folders: files.map(function (f) {
        return path.resolve(bpath, dir, f);
      }).filter(function (f) {
        return fs.statSync(f).isDirectory();
      })
    };
  });
};

// mkdir -p promise
var pmkdirp = function pmkdirp(dir) {
  return new Promise(function (resolve, reject) {
    mkdirp(dir, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
// gm merge images
var gmMergeFiles = function gmMergeFiles() {
  var files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var conf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _conf$direction = conf.direction,
      direction = _conf$direction === undefined ? 'h' : _conf$direction,
      fullname = conf.fullname;


  var outputgm = files.sort(function (a, b) {
    return a.number - b.number;
  }).reduce(function (gminst, f, i) {
    if (!gminst) {
      return gm(f.fullname);
    }
    return gminst.append(f.fullname, direction == 'h');
  }, '');

  // gm write promise
  var pgmwrite = function pgmwrite(dir) {
    return new Promise(function (resolve, reject) {
      outputgm.write(dir, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
  // mkdir -p
  return pmkdirp(path.dirname(fullname)).then(function () {
    return pgmwrite(fullname);
  });
};

// imagemin compress
var imageminCompress = function imageminCompress(file) {
  return imagemin([file], path.resolve(path.dirname(file), 'compressed'), {
    plugins: [imageminJpegtran(), imageminPngquant({
      // 这个参数报错：image degradation MSE=15.004 (Q=55) exceeded limit of 11.334 (65)
      // imagemin-pngquant 这个模块并没有处理这种错误，只是继续抛出错误
      // quality: '65-80',
      // verbose: true
    })]
  });
};

// get image size

// resize image

// scale image
var scaleImage = function scaleImage(file) {
  var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var ofile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  return new Promise(function (resolve, reject) {
    var scaled = s * 100 + '%';
    if (!ofile) {
      var dir = path.dirname(file);
      var ext = path.extname(file);
      var bname = path.basename(file, ext);
      ofile = path.resolve(dir, bname + '.scaled' + ext);
    }

    gm(file).scale(scaled, scaled).write(ofile, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve(ofile);
    });
  });
};

// const path = require('path');


// const {
//   getFiles,
//   parseLinear,
//   gmMergeFiles,
//   imageminCompress,
//   resizeImage,
//   getImageSize,
//   scaleImage
// } = require('./util');

// log function
var log = function log(msg) {
  var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (verbose && msg) {
    console.log(msg);
  }
};

function csssteps() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // log
  config.fullname = path.resolve(process.cwd(), config.output, config.filename + '' + config.extention);

  log('config: ' + JSON.stringify(config, '', '\t') + '\n', config.verbose);

  log('> start get files', config.verbose);
  getFiles(config.directory, config).then(function (files) {
    if (files.files.length) {
      // log(`> start merge files: ${files.files.length}`, config.verbose);
      console.log(config.directory + ' ' + files.files.length + '\u4E2A\u6587\u4EF6');
      return gmMergeFiles(files.files, config);
    } else {
      files.folders.forEach(function (folder) {
        csssteps(Object.assign({}, config, { directory: folder, filename: path.basename(folder) }));
      });
      return Promise.reject(config.directory + ' no file');
    }
  }).then(function () {
    // scale image
    if (config.scale != 1) {
      log('> start scale file: ' + config.fullname, config.verbose);
      return scaleImage(config.fullname, config.scale);
    }
    return Promise.resolve(config.fullname);
  }).then(function (file) {
    // compress
    if (config.compress) {
      log('> start compress file: ' + file, config.verbose);
      return imageminCompress(file);
    }
  }).then(function (data) {
    log('> generated ok', config.verbose);
    log('> final fullpath: ' + data[0].path, config.verbose);
  }).catch(function (err) {
    log(err);
  });
}

module.exports = csssteps;
