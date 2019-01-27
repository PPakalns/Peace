const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    resolve: {
        root: path.resolve('./src')
    },
    entry: {
        app: path.resolve(__dirname, 'src/index.js'),
        vendor: ['phaser'],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js',
    },
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
    module: {
        rules: [
            {
                test: /\,js$/,
                include: path.resolve(__dirname, 'src/'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                    },
                },
            },
        ],
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },

    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
    },

    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/index.html'),
                to: path.resolve(__dirname, 'build/index.html'),
            },
            {
                from: path.resolve(__dirname, 'assets', '**'),
                to: path.resolve(__dirname, 'build'),
            },
        ]),
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true),
        }),
    ],
};
