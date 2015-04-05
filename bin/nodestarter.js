#!/usr/bin/env node

'use strict';

var argv        = require('minimist')(process.argv.slice(2)),
    fs          = require('fs'),
    path        = require('path'),
    scaffold    = require('scaffold-generator'),
    cwd         = process.cwd(),
    templateDir = argv.templatePath || path.join(__dirname, '..', 'template'),
    destDir     = argv.output || path.join(cwd, argv.name);

function logFailure(errorMessage, errorCode) {
  process.stderr.write(errorMessage + '\n');
  process.exit(errorCode || 1);
}

function logInfo(infoMessage) {
  process.stdout.write(infoMessage + '\n');
}

if ( !argv.name ) {
  logFailure('Project Name required. Use --name to provide.', 3);
}
if ( !argv.author ) {
  logFailure('Author required. Use --author to provide.', 3);
}
if ( !argv.email ) {
  logFailure('Email address required. Use --email to provide.', 3);
}
if ( !argv.repo ) {
  logFailure('Repository required. Use --repo to provide.', 3);
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

if ( fs.existsSync(destDir) ) {
  logFailure('Output directory already exists. Please try again.', 2);
} else {
  fs.mkdirSync(destDir);
}

scaffold({
  data: data
}).copy(templateDir, destDir, function (err) {
  if ( err ) {
    logFailure(err, 2);
  } else {
    logInfo('Project Created: "' + data.name + '" ' + data.version);
  }
});