'use strict';

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
import path from 'path';
import {
  getFiles,
  parseLinear,
  gmMergeFiles,
  imageminCompress,
  resizeImage,
  getImageSize,
  scaleImage
} from './util/index';


// log function
const log = (msg, verbose = true) => {
  if (verbose && msg) {
    console.log(msg);
  }
};

export default function csssteps(config = {}) {
  // log
  config.fullname = path.resolve(process.cwd(), config.output, config.filename + '' + config.extention);

  log(`config: ${JSON.stringify(config, '', '\t')}\n`, config.verbose);

  log('> start get files', config.verbose);
  getFiles(config.directory, config).then((files) => {
    if (files.files.length) {
      // log(`> start merge files: ${files.files.length}`, config.verbose);
      console.log(`${config.directory} ${files.files.length}个文件`);
      return gmMergeFiles(files.files, config);
    } else {
      files.folders.forEach((folder) => {
        csssteps(Object.assign({}, config, {directory: folder, filename: path.basename(folder)}));
      });
      return Promise.reject(config.directory + ' no file');
    }
  }).then(() => {
    // scale image
    if (config.scale != 1) {
      log(`> start scale file: ${config.fullname}`, config.verbose);
      return scaleImage(config.fullname, config.scale);
    }
    return Promise.resolve(config.fullname);
  }).then((file) => {
    // compress
    if (config.compress) {
      log(`> start compress file: ${file}`, config.verbose);
      return imageminCompress(file);
    }
  }).then((data) => {
    log('> generated ok', config.verbose);
    log(`> final fullpath: ${data[0].path}`, config.verbose);
  }).catch(err => {
    log(err);
  });
};