#!/usr/bin/env node
'use strict';

// Require modules
const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const write = require('write');
const del = require('del');
const postcss = require('postcss')
const readdir = require('readdir');
const inquirer = require('inquirer');
const chalk = require('chalk');
const chokidar = require('chokidar');

// Logging
const prefix = chalk.magenta.bold(' >  ');
const print = msg => console.log(prefix + msg);
const printErr = msg => console.error(prefix + chalk.red(msg));

// Files
const baseInput = 'sass/style.sass';
const baseOutput = 'assets/css/style.min.css';

/**
 * Compiles the .sass files for the given project.
 */
function compile(basePath) {
  // Project files
  const input = path.resolve('packages', basePath, baseInput);
  const output = path.resolve('packages', basePath, baseOutput);

  print('Running compilation for: ' + chalk.green(basePath));

  // Watch file or run once?
  if (process.argv.indexOf('--watch') !== -1) {
    print(`Now watching for file changes at ${chalk.green(input)}...`)
    chokidar.watch(path.join('packages', basePath, '**/*.sass'))
      .on('change', path => run());
  } else {
    run();
  }

  function run() {
    // delete old file
    del(output)

      // compile sass
      .then(_paths => {
        return new Promise((resolve, reject) => {
          print(`Compile sass from file ${chalk.cyan(input)}...`);
          sass.render({ file: input }, (err, result) => {
            if (err) reject(err);
            else resolve(result.css.toString());
          });
        });
      })

      // optimize css
      .then(result => {
        print('Optimize css using cssnano...');
        return postcss([
          require('cssnano')({ preset: 'advanced' })
        ])
          .process(result, { from: undefined });
      })

      // write css to file
      .then(result => {
        print(`Write css to ${output}...`);
        return new Promise((resolve, reject) => {
          write(output, result, err => {
            if (err) reject(err);
            else resolve();
          });
        });
      })

      // finish handlers
      .then(() => print('Done.'))
      .catch(err => printErr(err.formatted));
  }
}

// Use last?
if (process.argv.indexOf('--last') !== -1) {
  if (fs.existsSync('.last-package')) {
    compile(fs.readFileSync('.last-package').toString());
  } else {
    printErr('Run without --last at least once!');
  }
}

// Get available packages
else {
  readdir.read('packages/', ['*/'], readdir.INCLUDE_DIRECTORIES + readdir.NON_RECURSIVE,
    (err, directories) => {
      if (err) throw err;
      else {
        // Choose the target package
        inquirer.prompt([
          {
            type: 'list',
            name: 'project',
            message: 'Select the project to compile the SASS files for:',
            choices: directories.sort()
          }
        ])
          // Compile!
          .then(result => {
            fs.writeFileSync('.last-package', result.project);
            compile(result.project)
          })
          .catch(printErr);
      }
    });
}