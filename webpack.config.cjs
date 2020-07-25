module.exports = {
    entry: './src/main.js',
    output: {
        filename: './index.js'
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/,
                use: 'babel-loader' 
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            }
        ]
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};