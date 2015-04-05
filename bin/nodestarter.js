#!/usr/bin/env node

'use strict';

var argv        = require('minimist')(process.argv.slice(2)),
    /**
     * File System Module
     * @type {*}
     */
    fs          = require('fs'),
    /**
     * Path Module
     * @type {*}
     */
    path        = require('path'),
    /**
     * Scaffold Module
     * @type {scaffold|exports|module.exports}
     */
    scaffold    = require('scaffold-generator'),
    /**
     * The current working directory
     * @type {string|String}
     */
    cwd         = process.cwd(),
    /**
     * The directory containing the template files
     * @type {string|string}
     */
    templateDir = argv.templatePath || path.join(__dirname, '..', 'template'),
    /**
     * The directory to output the new project to
     * @type {string|string}
     */
    destDir     = argv.output || path.join(cwd, argv.name);

/**
 * Log an error message and kill the process
 *
 * @param {string} errorMessage - The message to log
 * @param {number} errorCode - The level of severity
 *
 * @returns {void}
 */
function logFailure(errorMessage, errorCode) {
  process.stderr.write(errorMessage + '\n');
  process.exit(errorCode || 1);
}

/**
 * Log an informational message
 *
 * @param {string} infoMessage - The message to log
 *
 * @returns {void}
 */
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

/**
 * The data to use in the template
 *
 * @type {{name: string, version: (string|String|string|string), description: (string|string), author: string, email: string, website: string, repo: string, license: (string|string)}}
 */
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

if ( !fs.existsSync(templateDir) ) {
  logFailure('Template directory does not exist. Please try again.', 2);
}

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