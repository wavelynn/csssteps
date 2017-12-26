// const fs = require('fs');
// const path = require('path');
// const gm = require('gm');
// const mkdirp = require('mkdirp');

// const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');

import fs from 'fs';
import path from 'path';
import gm from 'gm';
import mkdirp from 'mkdirp';
import imagemin from 'imagemin';

import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

// promise fs.readdir
export const preaddir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      err ? reject(err) : resolve(files);
    });
  });
};


// an+b
export const parseLinear = (f = '') => {
  const m = /^(\d+)n(\s*\+\s*(\d+))?$/.exec(f.toString().trim()) || [];
  let a = parseInt(m[1] || 1, 10);
  let b = parseInt(m[3] | 0, 10);
  if (a <= b) {
    console.warn('> please use an+b, a<b, otherwise a=1, b=0');
    a = 1;
    b = 0;
  }
  return [a, b];
};

// get files of directory with extenstion
export const getFiles = (dir = '', conf = {}) => {
  let files = [];
  let bpath = process.cwd();
  let {
    extention = '.png', 
    which = 0,
  } = conf;

  const [a, b] = parseLinear(conf.which || '');
  const fulldir = path.resolve(bpath, dir);

  return preaddir(fulldir).then((files) => {
    extention = extention.indexOf('.') == 0 ? extention : '.' + extention;
    return {
      files: files.filter(f => path.extname(f) == extention).map(f => {
                const m = /\d+/.exec(f);

                if (!m) {
                  console.warn('> cannot found file sequence number in file name...');
                }
                return {
                  fullname: path.resolve(bpath, dir, f),
                  number: m ? parseInt(m[0], 10) : 0
                };
              }).filter((f, i) => {
                // 每 n (which) 张选择一张，比如只用奇数 或者 偶数
                return i % a == b;
              }),
      folders: files.map(f => path.resolve(bpath, dir, f)).filter(f => fs.statSync(f).isDirectory()),
    };
  });
};

// mkdir -p promise
export const pmkdirp = (dir) => {
  return new Promise((resolve, reject) => {
    mkdirp(dir, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
// gm merge images
export const gmMergeFiles = (files = [], conf = {}) => {
  const {
    direction = 'h',
    fullname
  } = conf;

  const outputgm = files.sort((a, b) => a.number - b.number).reduce((gminst, f, i) => {
    if (!gminst) {
      return gm(f.fullname);
    }
    return gminst.append(f.fullname, direction == 'h');
  }, '');

  // gm write promise
  const pgmwrite = (dir) => {
    return new Promise((resolve, reject) => {
      outputgm.write(dir, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
  // mkdir -p
  return pmkdirp(path.dirname(fullname)).then(() => {
    return pgmwrite(fullname);
  });
};

// imagemin compress
export const imageminCompress = (file) => {
  return imagemin([file], path.resolve(path.dirname(file), 'compressed'), {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        // 这个参数报错：image degradation MSE=15.004 (Q=55) exceeded limit of 11.334 (65)
        // imagemin-pngquant 这个模块并没有处理这种错误，只是继续抛出错误
        // quality: '65-80',
        // verbose: true
      })
    ]
  });
};

// get image size
export const getImageSize = (file) => {
  return new Promise((resolve, reject) => {
    gm(file).size((err, size) => {
      if (err) {
        return reject(err);
      }
      return resolve(size);
    });
  });
};
// resize image
export const resizeImage = (file, ofile, width, height) => {
  return new Promise((resolve, reject) => {
    gm(file).resize(width, height).write(ofile, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};
// scale image
export const scaleImage = (file, s = 1, ofile = '') => {
  return new Promise((resolve, reject) => {
    const scaled = `${s*100}%`;
    if (!ofile) {
      const dir = path.dirname(file);
      const ext = path.extname(file);
      const bname = path.basename(file, ext);
      ofile = path.resolve(dir, bname + '.scaled' + ext);
    }

    gm(file).scale(scaled, scaled).write(ofile, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(ofile);
    });
  });
};

export default {
  preaddir,
  getFiles,
  pmkdirp,
  parseLinear,
  gmMergeFiles,
  imageminCompress,
  getImageSize,
  resizeImage,
  scaleImage
};