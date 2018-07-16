#!/usr/bin/env node
'use strict';

// Require modules
const path = require('path');
const sass = require('node-sass');
const write = require('write');
const del = require('del');
const cssnano = require('cssnano')({ preset: 'advanced'});
const readdir = require('readdir');
const inquirer = require('inquirer');

// Files
const baseInput = 'sass/style.sass';
const baseOutput = 'assets/css/style.min.css';

/**
 * Compiles the .sass files for the given project.
 */
function process(basePath) {
  // Project files
  const input = path.resolve('packages', basePath, baseInput);
  const output = path.resolve('packages', basePath, baseOutput);

  // delete old file
  del(output)

  // compile sass
  .then(_paths => {
    return new Promise((resolve, reject) => {
      console.log(`Compile sass from file ${input}...`);
      sass.render({ file: input }, (err, result) => {
        if (err) reject(err);
        else resolve(result.css.toString());
      });
    });
  })

  // optimize css using cssnano
  .then(result => {
    console.log('Optimize css using cssnano...');
    return cssnano.process(result);
  })

  // write css to file
  .then(result => {
    console.log(`Write css to ${output}...`);
    return new Promise((resolve, reject) => {
      write(output, result, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  })

  // finish handlers
  .then(() => console.log('Done.'))
  .catch(console.error);
}

// Get available packages
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
          choices: directories
        }
      ])
        // Compile!
        .then(result => process(result.project))
        .catch(console.error);
    }
  });
