import babel from 'rollup-plugin-babel';

export default {
  input: 'src/csssteps.js',
  output: {
    file: 'app/index.js',
    format: 'cjs'
  }, 
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};