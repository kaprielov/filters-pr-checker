#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commander = require('commander');
var path = require('path');
var fsExtra = require('fs-extra');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const REDIRECTS_CONFIG_PATH = 'redirects.yml';
const REDIRECTS_RESOURCES_SRC_PATH = 'redirect-files';
const REDIRECTS_RESOURCES_DEST_PATH = 'redirects';
const src = path__default["default"].resolve(require.resolve('@adguard/scriptlets'), '../..');
const copyWar = (dest) => __awaiter(void 0, void 0, void 0, function* () {
    dest = path__default["default"].resolve(process.cwd(), dest);
    try {
        yield fsExtra.copy(path__default["default"].resolve(src, REDIRECTS_CONFIG_PATH), path__default["default"].resolve(dest, REDIRECTS_CONFIG_PATH));
        yield fsExtra.copy(path__default["default"].resolve(src, REDIRECTS_RESOURCES_SRC_PATH), path__default["default"].resolve(dest, REDIRECTS_RESOURCES_DEST_PATH));
        console.info(`Web accessible resources was copied to ${dest}`);
    }
    catch (e) {
        console.error(e.message);
    }
});

const DEFAULT_WAR_PATH = 'build/war';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        commander.program
            .name('tswebextension')
            .description('CLI to some development utils')
            .version('0.0.1');
        commander.program
            .command('war')
            .description('Downloads web accessible resources for redirect rules')
            .argument('[path]', 'resources download path', DEFAULT_WAR_PATH)
            .action(copyWar);
        yield commander.program.parseAsync(process.argv);
    });
}
const isRunningViaCli = require.main === module;
if (isRunningViaCli) {
    main();
}

exports.DEFAULT_WAR_PATH = DEFAULT_WAR_PATH;
exports.copyWar = copyWar;
