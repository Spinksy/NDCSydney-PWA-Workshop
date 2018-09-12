const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const pathsToClean = [
    '../Ndc.Workshop.Server/wwwroot/*.*'
];

const cleanOptions = {
    allowExternal: true
};

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
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
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
                    from: path.resolve(__dirname, 'src/js/'),
                    to:'js'
                },
                {
                    from: path.resolve(__dirname, 'src/assets/'),
                    to:'assets'
                },
                {
                    from: path.resolve(__dirname, 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'),
                    to:'wc'
                },
                {
                    from: path.resolve(__dirname, 'node_modules/@webcomponents/webcomponentsjs/bundles'),
                    to:'wc/bundles'
                }
            ]
        ),
        new ManifestPlugin({fileName: 'filemanifest.json'}),
        new WorkboxPlugin.GenerateSW({
            swDest: 'sw.js',
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [{
                urlPattern: new RegExp('https://localhost:5001/api'),
                handler: 'staleWhileRevalidate'
            }]
        })
    ]
}