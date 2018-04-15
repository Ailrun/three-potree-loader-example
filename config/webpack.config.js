const path = require('path');

const rootPath = path.join(__dirname, '..');

module.exports = {
  entry: [
    './src/main.js',
  ],
  output: {
    filename: 'index.js',
    path: path.join(rootPath, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(rootPath, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              extends: path.join(rootPath, 'config', '.babelrc.js'),
            },
          }
        ],
      },
    ],
  },

  devtool: 'source-map',

  devServer: {
    contentBase: path.join(rootPath, 'public'),
  },
};
