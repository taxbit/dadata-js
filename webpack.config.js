const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        
                      }
                    },
                    {
                      loader: 'css-loader',
                      options: {importLoaders: 1},
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        config: {
                          path: __dirname + '/postcss.config.js'
                        }
                      },
                    },
                  ],
            },
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/i,
                use: [
                        'file-loader?name=./images/[name].[ext]', // указали папку, куда складывать изображения
                        {
                                loader: 'image-webpack-loader',
                                options: {
                                    
                                },
                        },
                ],
            },

        ]
    },
    plugins: [ 
        new MiniCssExtractPlugin({
                filename: 'style.css'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyWebpackPlugin([
            {from:'src/images',to:'images'} 
        ]),
    ]
};