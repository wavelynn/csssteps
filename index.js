'use strict';

const csssteps = require('./app/index');
const compress = require('./compress');

csssteps.compress = compress;

module.exports = csssteps;