const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
        ]
    },
    devServer: {
        client: {
            overlay: true
        },
        hot: true,
        watchFiles: ['src/*', 'index.html']
    },
    devtool: 'eval-source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                'index.html',
                'favicon.ico',
                {from: 'node_modules/jquery/dist/jquery.min.js', to: 'assets/js'},
                {from: 'node_modules/jquery-ui-dist/jquery-ui.min.css', to: 'assets/css'},
                {from: 'node_modules/jquery-ui-dist/jquery-ui.min.js', to: 'assets/js'},
                {from: 'semantic/dist', to: 'assets/semantic'},
            ]
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
