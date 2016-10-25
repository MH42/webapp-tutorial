var webpack = require('webpack');
var path = require('path');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test';

// Webpack Config
var webpackConfig = {
    entry: {
        'polyfills': './src/main/webapp/polyfills.browser.ts',
        'vendor': './src/main/webapp/vendor.browser.ts',
        'main': './src/main/webapp/main.browser.ts',
    },

    output: {
        path: './dist',
    },

    plugins: [],

    module: {
        loaders: [
            // .ts files for TypeScript
            {test: /\.ts$/, loaders: ['awesome-typescript-loader', 'angular2-template-loader']},
            {test: /\.css$/, loaders: ['to-string-loader', 'css-loader']},
            {test: /\.html$/, loader: 'raw-loader'}
        ]
    }
};

// Karma + Phantom have some issues with the CommonsChunkPlugin,
// so we don't add it when we test
if (!isTest) {
    webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin(true));
    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin(
        {name: ['main', 'vendor', 'polyfills'], minChunks: Infinity}));
}

// Our Webpack Defaults
var defaultConfig = {
    devtool: 'cheap-module-source-map',
    cache: true,
    debug: true,
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        root: [path.join(__dirname, 'src')],
        extensions: ['', '.ts', '.js']
    },

    devServer: {
        historyApiFallback: true,
        watchOptions: {aggregateTimeout: 300, poll: 1000}
    },

    node: {
        global: 1,
        crypto: 'empty',
        module: 0,
        Buffer: 0,
        clearImmediate: 0,
        setImmediate: 0
    }
};

var webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);