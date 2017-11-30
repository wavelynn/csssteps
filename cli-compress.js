#! /usr/local/bin/node
'use strict';

const path = require('path');
const program = require('commander');
const csssteps = require('./index');

program
  .version('0.0.1')
  .option('-i, --input <input>', 'directory to compress')
  .option('-o, --output [output]', 'where to output compressed files', 'output')
  .parse(process.argv);


// compress
const conf = {
  input: program.input.split(',').map((p) => {
    return path.resolve(process.cwd(), p, '**/*.{png,jpg,jpeg}');
  }), 
  output: path.resolve(process.cwd(), program.output || 'output') 
};

csssteps.compress(conf.input, conf.output).then(data => {
  console.log('compress ok');
});