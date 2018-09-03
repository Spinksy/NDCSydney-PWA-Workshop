const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/components/shell.js'},
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, '../Ndc.Workshop.Server/wwwroot')


    },
    devtool: "eval-source-map",
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
            filename: "index.html",
            inject: false
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: path.resolve(__dirname, "src/manifest.json"),
                    to:''
                },
                {
                    from: path.resolve(__dirname, 'src/sw.js'),
                    to:''
                },
                {
                    from: path.resolve(__dirname, 'src/js/'),
                    to:'js'
                },
                {
                    from: path.resolve(__dirname, 'src/assets/'),
                    to:'assets'
                }
    
                
            ]
        )
    ]
}