/* eslint-disable no-console */
import webpack, { Configuration, Stats, Watching } from 'webpack';

declare interface CallbackFunction<T> {
    (err?: null | Error, result?: T): unknown;
}

export const buildRunner = (webpackConfig: Configuration, watch = false): Promise<void> => {
    const compiler = webpack(webpackConfig);

    console.log(compiler.options.context);

    const run = watch
        ? (cb: CallbackFunction<Stats>): Watching => compiler.watch({}, cb)
        : (cb: CallbackFunction<Stats>): void => compiler.run(cb);

    return new Promise((resolve, reject) => {
        run((err, stats) => {
            if (err) {
                console.error(err.stack || err);
                reject();
                return;
            }
            if (stats) {
                if (stats && stats.hasErrors()) {
                    console.log(stats.toString({
                        colors: true,
                        all: false,
                        errors: true,
                        moduleTrace: true,
                        logging: 'error',
                    }));
                    reject();
                    return;
                }

                console.log(stats.toString({
                    chunks: false, // Makes the build much quieter
                    colors: true, // Shows colors in the console
                }));
            }

            resolve();
        });
    });
};
