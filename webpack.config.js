const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    resolve: {
        alias:{
            '@': path.resolve(__dirname, 'src'),
        }
    },
    entry: {
        index: './src/js/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'display_system',
            template: './public/index.html'
        })
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
};