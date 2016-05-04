'use strict';
var util = require('util'),
    chalk = require('chalk');

var ScriptBase = require('../script-base.js');

var sttGenerator = module.exports = function sttGenerator() {
	ScriptBase.apply(this, arguments);
};

util.inherits(sttGenerator, ScriptBase);

sttGenerator.prototype.createDirectiveFiles = function createDirectiveFiles() {
  this.log(
    chalk.yellow('\n┌──────────────────────────────────────────────────────────────┐ \n' +
                   '| Creating directive, please wait...                           | \n' +
                   '└──────────────────────────────────────────────────────────────┘ ')
  );

  this.generateSourceAndTest(
  	'_directive',
  	'spec/directive',
  	'directives',
  	this.options['add-index'] || false
  );
};
