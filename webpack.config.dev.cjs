const HtmlWebpackPlugin = require('html-webpack-plugin');

const languages = ['GMS', 'KMS', 'TMS'];

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [{'plugins': ['@babel/plugin-proposal-class-properties']}]
                }
            },
            {
                test: /\.css$/,
                loader: [
                  'style-loader',
                  'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: false,
            languages
        }),
    ],
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};