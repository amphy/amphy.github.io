const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		main: path.resolve(__dirname, './assets/index.css'),
		fonts: './assets/fonts.js',
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: isProduction ? '[name].[hash].js' : '[name].js',
		chunkFilename: isProduction ? '[id].[hash].js' : '[id].js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === 'development',
						},
					},
					'css-loader',
					'postcss-loader',
				]
			},
			{
				test: /\.(woff(2)?|tff|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: isProduction ? '[name].[hash].css' : '[name].css'
		}),
		new ManifestPlugin({
			fileName: '../_data/manifest.yml',
			publicPath: './dist/',
		}),
	],
};