const path = require('path');
const webpack = require('webpack');
const { NODE_ENV = 'production' } = process.env;
require('dotenv').config();

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
      NODE_ENV: NODE_ENV,
      S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
      S3_SECRET_KEY: process.env.S3_SECRET_KEY,
      S3_ENDPOINT: process.env.S3_ENDPOINT,
      S3_REGION: process.env.S3_REGION,
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    }),
  ],
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
};
