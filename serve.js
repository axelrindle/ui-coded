#!/usr/bin/env node
'use strict';

// Require modules
const path = require('path');
const readdir = require('readdir');
const inquirer = require('inquirer');
const httpServer = require('http-server');

function serve(project) {
  const dir = `./packages/${project}`;
  const port = 8080;
  const server = httpServer.createServer({ root: path.resolve(dir) });
  server.listen(port, () => {
    console.log(`Serving ${dir}`);
    console.log(`Listening on ${port}`);
    console.log('Hit CTRL-C to stop the server');
  });
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
          message: 'Select the project to serve:',
          choices: directories
        }
      ])
        // Serve!
        .then(result => serve(result.project))
        .catch(console.error);
    }
  });
