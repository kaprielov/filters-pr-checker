/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    target: 'node',
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['*', '.ts', '.js'],
    },
    externals: {
        'playwright-chromium': 'commonjs2 playwright-chromium',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'swc-loader',
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                            },
                        },
                    },
                },
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
    ],
};
