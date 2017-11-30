#! /usr/local/bin/node
'use strict';

const path = require('path');
const program = require('commander');
const csssteps = require('./index');

program
  .version('0.0.1')
  .option('-d, --directory <directory>', 'which directory to be merged')
  .option('-e, --extention [extension]', 'what type of file to merge', /^\.(jpg|jpeg|png|webp)$/i, '.png')
  .option('-dr, --direction [direction]', 'which direction to merge image', /^(h|v)$/i, 'h')
  .option('-o, --output [output]', 'where to output merged file', 'output')
  .option('-f, --filename [filename]', 'what is name of merged file', '')
  .option('-c, --compress [compress]', 'whether to compress merged file', true)
  .option('-w, --which [which]', 'which files in directory to merge', 1)
  .option('-s, --scale [scale]', 'how to resize merged file, scale ratio', 1)
  .option('-v, --verbose', 'show detail info', false)
  .parse(process.argv);

csssteps({
  directory: program.directory,
  extention: program.extention,
  direction: program.direction,
  output: path.resolve(process.cwd(), program.output) || path.resolve(process.cwd(), './output'),
  filename: program.filename || path.basename(program.directory),
  compress: program.compress,
  which: program.which,
  scale: program.scale || 1, 
  verbose: !!program.verbose
});