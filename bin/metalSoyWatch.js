#!/usr/bin/env node

'use strict';

const chokidar = require('chokidar');
const metalToolsSoy = require('metal-tools-soy');
const defaultOptions = require('../node_modules/metal-tools-soy/lib/options.js');
const path = require('path');
const yargs = require('yargs')
  .option('dest', {
		alias: 'd',
		default: defaultOptions.dest,
		describe: 'The directory where the compiled files will be stored.',
		type: 'string'
	})
	.option('externalMsgFormat', {
		default: defaultOptions.externalMsgFormat,
		describe: 'Pattern that should be used to format the extracted external messages from compiled files',
		type: 'string'
	})
	.option('outputDir', {
		alias: 'o',
		default: defaultOptions.outputDir,
		type: 'string'
	})
	.option('skipMetalGeneration', {
		default: defaultOptions.skipMetalGeneration,
		describe: 'Passing this will cause soy files to be just compiled, without the addition of metal generated code (like the component class)',
		type: 'boolean'
	})
	.option('soyDeps', {
		default: defaultOptions.soyDeps,
		describe: "Soy files that the main source files depend on, but that shouldn't be compiled as well. The soy compiler needs these files.",
		type: 'array'
	})
	.option('src', {
		alias: 's',
		default: defaultOptions.src,
		describe: 'The path globs to the soy files to be compiled.',
		type: 'array'
  })
  .alias('v', 'version')
	.version(function() {
		return require('../package').version;
	})
	.alias('h', 'help')
	.help().argv;

console.info('Starting watch mode');

chokidar.watch(yargs.src).on('all', event => {
    if (event === 'change' || event === 'add') {
      const stream = metalToolsSoy(yargs);

      console.info('Compiling soy');
      stream.on('data', (file) => {
        if (file.path) {
          console.log('Generated ' + path.relative(process.cwd(), file.path));
        }
      });
      stream.on('end', () => {
        console.info('Finished compiling soy');
      });
    }
  });