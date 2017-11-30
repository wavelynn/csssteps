const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegtran = require('imagemin-jpegtran');

module.exports = function (input, output) {
  return imagemin(input, output, {
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