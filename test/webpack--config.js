/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin      = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin         = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin   = require('mini-css-extract-plugin');
const postcssPresetEnv       = require('postcss-preset-env');
const StyleLintPlugin        = require('stylelint-webpack-plugin');
const glob                   = require('glob');
const I18nPlugin             = require("i18n-webpack-plugin");

const __DEV__ = process.env.NODE_ENV === "dev";

let config = {
		entry: {
				main: ['./src/scss/main.scss', './src/index.js']
		},
		output: {
				path: path.resolve(__dirname, "dist"),
				publicPath: "/dist/",
				filename: "[name].js"
				/*
				filename: (__DEV__) ? "[name].js" : "[name].[chunkhash].js",
				chunkFilename: (__DEV__) ? "[name].js" : "[name].[chunkhash].js"
				*/
		},
		resolve: {
				alias: {
						'@scss': path.resolve('./assets/scss/'),
						'@css': path.resolve('./assets/css/'),
						'@': path.resolve('./assets/js/')
				}
		},
		watch: __DEV__,
		devServer: {
				contentBase: path.resolve('./dist'),
				host: 'localhost',
				port: 9090,
				open: true,
				//compress: false,
				hot: true,
				noInfo: false,
				overlay: true,
				useLocalIp: false
		},
		devtool: __DEV__ ? "cheap-module-eval-source-map" : "source-map",
		module: {
			rules: [
					/*
						{
								enforce: 'pre',
								test: /\.js$/,
								exclude: /node_modules/,
								use: {
										loader: "eslint-loader"
								}
						},
					*/
						{
								test: /\.js$/,
								exclude: /node_modules/,
								use: {
										loader: "babel-loader",
										options: {
												presets: ["@babel/preset-env"]
										}
								}
						},
						{
								test: /\.ejs$/,
								exclude: /node_modules/,
								use: {
										loader: "ejs-loader"
								}
						},
						// Gestion des fichiers CSS
						{
								test: /\.css$/,
								use: [
										"style-loader",
										MiniCssExtractPlugin.loader,
										{ loader: 'css-loader', options: { importLoaders: 1 } },
										"postcss-loader"
								]
						},
						// Gestion des fichiers SCSS
						{
								test: /\.scss$/,
								use: [
									'style-loader',
									MiniCssExtractPlugin.loader,
									{ loader: 'css-loader', options: { importLoaders: 1 } },
									'postcss-loader',
									'sass-loader'
								]
						},
						// Gestion des images
						{
								test: /\.(gif|png|jpe?g|svg)$/i,
								use: [
										{
												loader: 'url-loader',
												options: {
														limit: 8192,
														name: '[name].[hash:7].[ext]'
												},
										},
								],
						},
						// Gestion des fonts
						{
								test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
								use: [
								{
										loader: "file-loader",
										options: {
												name: "[name].[ext]",
												outputPath: "fonts/"
										}
								}
								]
						}
						// Fin rules
				]
		},
		plugins: [
				new CleanWebpackPlugin({
						verbose: true,
						dry: true
				}),
				new MiniCssExtractPlugin({
						filename: "style.css"
				}),
				/*
				new HtmlWebpackPlugin({
						//inject  : false,
						//hash    : true,
						template: "./src/index.ejs",
						filename: "index.html",
						//favicon : "favicon.ico",        // or use favicons-webpack-plugins
						minify  : {
								collapseWhitespace   : true,
								removeComments       : true,
								removeAttributeQuotes: true
						}
				}),
				*/
				//new WebpackMd5Hash(),
				new StyleLintPlugin({
						configFile: './stylelint.config.js',
						files: './src/scss/*.scss',
						syntax: 'scss'
				})
		],
		optimization: {
				//nodeEnv: 'production'
				//minimizer: [new UglifyJsPlugin()],
		}
};


if (!__DEV__) {
		config.plugins.push(
				new UglifyJsPlugin({
						sourceMap: true
				})
		);
		config.plugins.push(
				new CleanWebpackPlugin({
						verbose: true,
						dry: false
				})
		);
}
/*
if (__DEV__){
		webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
		webpackConfig.plugins.push(new webpack.NamedModulesPlugin())
}
*/

var languages = {
	fr: require("./src/data/fr.json"),
	de: require("./src/data/de.json")
};

const pays =
{
	"fr": {
		"folder": "FR",
		"url": "intershop/fr"
	},
	"de": {
		"folder": "DE",
		"url": "intershop/de"
	}
}

const files = glob.sync(process.cwd() + '/src/*.ejs')
files.forEach(file => {
		Object.keys(languages).map(function (language) {
			config.plugins.push(new I18nPlugin(languages['de']))
		}),
		config.plugins.push(new HtmlWebpackPlugin({
				filename: path.basename(file).replace('.ejs','.html'),
				template: file
		}))
})

module.exports = config;
