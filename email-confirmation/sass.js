#!/usr/bin/env node
'use strict';

// Require modules
const fs = require('fs');
const sass = require('node-sass');
const write = require('write');
const del = require('del');
const cssnano = require('cssnano')({ preset: 'advanced'});

// Files
const input = 'sass/style.sass';
const output = 'site/css/style.min.css';

// Process
del(output) // delete old file
.then(_paths => { // compile sass
  return new Promise((resolve, reject) => {
    console.log(`Compile sass from file ${input}...`);
    sass.render({ file: input }, (err, result) => {
      if (err) reject(err);
      else resolve(result.css.toString());
    });
  });
})
.then(result => { // optimize css using cssnano
  console.log('Optimize css using cssnano...');
  return cssnano.process(result);
})
.then(result => { // write css to file
  console.log(`Write css to ${output}...`);
  return new Promise((resolve, reject) => {
    write(output, result, err => {
      if (err) reject(err);
      else resolve();
    });
  });
})
.then(() => console.log('Done.'))
.catch(err => console.error(err));
