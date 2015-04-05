#!/usr/bin/env node

'use strict';

var argv        = require('minimist')(process.argv.slice(2)),
    fs          = require('fs'),
    path        = require('path'),
    scaffold    = require('scaffold-generator'),
    cwd         = process.cwd(),
    templateDir = path.join(__dirname, '..', 'template'),
    destDir;

if ( !argv.name ) {
  logError('Project Name required', 3);
}
if ( !argv.author ) {
  logError('Author name required', 3);
}
if ( !argv.email ) {
  logError('Email required', 3);
}
if ( !argv.repo ) {
  logError('Repository required', 3);
}

var data = {
  name: argv.name,
  version: argv.version || '0.0.1',
  description: argv.description || '',
  author: argv.author,
  email: argv.email,
  website: argv.website || argv.repo,
  repo: argv.repo,
  license: argv.license || 'MIT'
};

destDir = path.join(cwd, data.name);

if ( fs.existsSync(destDir) ) {
  logError('Destination directory already exists', 2);
} else {
  fs.mkdirSync(destDir);
}

scaffold({
  data: data
}).copy(templateDir, destDir, function (err) {
  if ( err ) {
    logError(err, 2);
  } else {
    logInfo('Created: "' + data.name + '" ' + data.version);
  }
});

function logError(errorMessage, errorCode) {
  process.stderr.write(errorMessage + '\n');
  process.exit(errorCode || 1);
}

function logInfo(infoMessage) {
  process.stdout.write(infoMessage + '\n');
}