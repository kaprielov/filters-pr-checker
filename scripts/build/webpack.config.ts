import path from 'path';
import { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const CONTEXT_DIR = path.resolve(__dirname, '../../src/extension');
const BACKGROUND_PATH = path.join(CONTEXT_DIR, 'pages/background');
const CONTENT_SCRIPT_PATH = path.join(CONTEXT_DIR, 'pages/content-script');
const BUILD_PATH = path.resolve(__dirname, '../../dist/extension');

export const config: Configuration = {
    mode: 'development',
    devtool: 'eval-source-map',
    context: CONTEXT_DIR,
    entry: {
        background: BACKGROUND_PATH,
        'content-script': CONTENT_SCRIPT_PATH,
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                            },
                        },
                    },
                }],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(BACKGROUND_PATH, 'index.html'),
            filename: 'background.html',
            chunks: ['background'],
            cache: false,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: '.',
                    from: 'manifest.json',
                    to: 'manifest.json',
                },
            ],
        }),
    ],
};
