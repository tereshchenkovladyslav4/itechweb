var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
      historyApiFallback: true
  },
  externals: {
      // global app config object
      config: JSON.stringify({
          apiUrl: 'http://localhost:49807'
      })
  },
  resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
          '@': path.resolve(__dirname, 'src/'),
      }
  },
  plugins: [new HtmlWebpackPlugin({
      template: './src/index.html'
  })],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /SvgIcon$/,
        use: {
          loader: 'raw-loader',
        }
      }
    ]
  }  
};
