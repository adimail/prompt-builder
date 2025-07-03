const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isGhPages = process.env.GITHUB_PAGES === 'true';
const publicPath = isGhPages ? '/prompt-builder/' : '/';

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.tsx',
    studio: './src/studio.tsx',
    gallery: './src/gallery.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './public/studio.html',
      filename: 'studio.html',
      chunks: ['studio'],
    }),
    new HtmlWebpackPlugin({
      template: './public/gallery.html',
      filename: 'gallery.html',
      chunks: ['gallery'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/studio/, to: '/studio.html' },
        { from: /^\/gallery/, to: '/gallery.html' },
      ],
    },
  },
};