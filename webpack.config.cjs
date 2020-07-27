module.exports = {
    entry: './src/main.js',
    output: {
        filename: './index.js'
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
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};